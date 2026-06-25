const crypto = require("crypto");
const axios = require("axios");
const { body } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const generateHtmlEmail = require("../utils/emailFormatter");
const { sendWelcomeTemplateEmail } = require("../utils/sendEmailJs");
const { sendEmailOtp, hasMsg91EmailConfig } = require("../utils/sendEmailOtp");

const FREE_POST_VALIDITY_DAYS = 90;
const OTP_EXPIRY_MINUTES = Math.max(Number(process.env.OTP_EXPIRY_MINUTES) || 5, 1);
const OTP_RESEND_COOLDOWN_SECONDS = Math.max(Number(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 45, 15);
const OTP_MAX_ATTEMPTS = Math.max(Number(process.env.OTP_MAX_ATTEMPTS) || 5, 3);
const OTP_HASH_SECRET = process.env.OTP_SECRET || process.env.JWT_SECRET || "myhosurproperty-otp-secret";

const EMAIL_OTP_PROVIDER = hasMsg91EmailConfig ? "msg91_email" : "development";

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

// Mask email: show first char + *** + domain, e.g. s***@gmail.com
const maskEmail = (email) => {
  if (!email || !email.includes("@")) return "your email address";
  const [local, domain] = email.split("@");
  const visible = local.length > 1 ? local[0] : local;
  return `${visible}***@${domain}`;
};

const buildFreeOnboardingPack = () => {
  const resetAt = new Date();
  resetAt.setDate(resetAt.getDate() + 30);

  const freePostExpiry = addDays(new Date(), FREE_POST_VALIDITY_DAYS);

  return {
    leadCredits: 5,
    canPostProperty: true,
    freePost: {
      used: false,
      expiresAt: freePostExpiry,
    },
    contactAccess: {
      monthlyLimit: 10,
      usedCount: 0,
      resetAt,
      isPremium: false,
    },
    activePlan: {
      planId: null,
      expiresAt: freePostExpiry,
      listingLimit: 1,
      listingsUsed: 0,
      isBoosted: false,
      contactUnlocks: 5,
      leadCredits: 0,
      boostDays: 0,
    },
  };
};

const ensureFreeOnboardingValidity = async (user) => {
  if (!user || user.activePlan?.planId) return user;

  const isFreeListingPlan = (user.activePlan?.listingLimit || 0) === 1;
  if (!isFreeListingPlan) return user;

  const accountStart = user.createdAt || new Date();
  const expectedExpiry = addDays(accountStart, FREE_POST_VALIDITY_DAYS);
  const currentFreeExpiry = user.freePost?.expiresAt ? new Date(user.freePost.expiresAt) : null;
  const currentPlanExpiry = user.activePlan?.expiresAt ? new Date(user.activePlan.expiresAt) : null;

  if ((!currentFreeExpiry || currentFreeExpiry < expectedExpiry) || (!currentPlanExpiry || currentPlanExpiry < expectedExpiry)) {
    user.freePost = {
      ...(user.freePost?.toObject ? user.freePost.toObject() : user.freePost || {}),
      expiresAt: expectedExpiry,
    };
    user.activePlan = {
      ...(user.activePlan?.toObject ? user.activePlan.toObject() : user.activePlan || {}),
      expiresAt: expectedExpiry,
    };
    await user.save();
  }

  return user;
};

const signupValidators = [
  body("name").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("phone").optional().trim(),
  body("password").isLength({ min: 6 }),
  body("role").optional().isIn(["buyer", "customer", "seller", "agent", "broker", "builder", "admin"]),
  body("address").optional().trim(),
];

const loginValidators = [
  body().custom((value) => {
    const hasEmail = typeof value.email === "string" && value.email.trim().length > 0;
    const hasPhone = typeof value.phone === "string" && value.phone.trim().length > 0;

    if (!hasEmail && !hasPhone) {
      throw new Error("Email or mobile number is required.");
    }

    if (hasEmail && !value.email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }

    return true;
  }),
  body("password").notEmpty().withMessage("Password is required"),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().trim(),
];

const socialLoginValidators = [body("provider").isIn(["google", "facebook"]), body("token").notEmpty()];

const verifyOtpValidators = [
  body("challengeId").trim().notEmpty(),
  body("otp").trim().isLength({ min: 4, max: 8 }).withMessage("OTP is required."),
];

const resendOtpValidators = [body("challengeId").trim().notEmpty()];

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  canPostProperty: user.canPostProperty,
  phone: user.phone,
  address: user.address,
  isPhoneVerified: Boolean(user.isPhoneVerified),
  isEmailVerified: Boolean(user.isEmailVerified),
  freePost: user.freePost,
  activePlan: user.activePlan,
  savedProperties: user.savedProperties,
  contactAccess: user.contactAccess,
  leadCredits: user.leadCredits,
});

const clearOtpState = (user) => {
  user.otpVerification = {
    challengeId: "",
    purpose: "",
    codeHash: "",
    expiresAt: null,
    resendAvailableAt: null,
    attempts: 0,
    maxAttempts: OTP_MAX_ATTEMPTS,
    lastSentAt: null,
    verifiedAt: null,
  };
};

const getClientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";


const hashOtp = (otp) =>
  crypto.createHash("sha256").update(`${otp}:${OTP_HASH_SECRET}`).digest("hex");

const createOtpCode = () => String(crypto.randomInt(100000, 1000000));

const buildOtpResponse = (user, meta = {}) => {
  const resendAvailableInSeconds = Math.max(
    0,
    Math.ceil(
      ((user.otpVerification?.resendAvailableAt ? new Date(user.otpVerification.resendAvailableAt).getTime() : 0) - Date.now()) /
        1000
    )
  );

  const expiresInSeconds = Math.max(
    0,
    Math.ceil(
      ((user.otpVerification?.expiresAt ? new Date(user.otpVerification.expiresAt).getTime() : 0) - Date.now()) /
        1000
    )
  );

  return {
    success: true,
    requiresOtp: true,
    challengeId: user.otpVerification?.challengeId,
    purpose: user.otpVerification?.purpose,
    destination: maskEmail(user.email),
    expiresInSeconds,
    resendAvailableInSeconds,
    provider: meta.provider || EMAIL_OTP_PROVIDER,
    ...(meta.developmentOtp ? { developmentOtp: meta.developmentOtp } : {}),
  };
};

const sendWelcomeEmail = async (user, providerLabel = "signing up") => {
  const emailJsResult = await sendWelcomeTemplateEmail(user, providerLabel);
  if (emailJsResult) {
    return emailJsResult;
  }
  throw new Error("Welcome email send failed via EmailJS");
};

const sendLoginAlert = async (user) => {
  const loginTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const loginHtml = generateHtmlEmail({
    name: user.name,
    title: "New Login Detected",
    message: `A new login was recorded for your account.\n\n<strong>Time:</strong> ${loginTime} (IST)\n<strong>Account:</strong> ${user.email}\n\nIf this was you, no action is needed. If you did <strong>not</strong> log in, please change your password immediately and contact our support team.`,
    buttonText: "Go to My Dashboard",
    buttonUrl: `${getClientUrl()}/dashboard`,
    type: "login",
  });

  const result = await sendEmail({
    to: user.email,
    subject: "Security Alert: New Login to Your MyHosurProperty Account",
    html: loginHtml,
    text: `A new login was recorded for your account at ${loginTime} (IST). If this was not you, please change your password immediately.`,
  });

  if (!result) {
    throw new Error("Login alert email send returned no result");
  }
};

const createOtpChallenge = async (user, purpose) => {
  const otp = createOtpCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
  const resendAvailableAt = new Date(now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000);

  user.otpVerification = {
    challengeId: crypto.randomUUID(),
    purpose,
    codeHash: hashOtp(otp),
    expiresAt,
    resendAvailableAt,
    attempts: 0,
    maxAttempts: OTP_MAX_ATTEMPTS,
    lastSentAt: now,
    verifiedAt: null,
  };

  await user.save();

  const delivery = await sendEmailOtp({
    email: user.email,
    name: user.name,
    otp,
    purpose,
  });

  return buildOtpResponse(user, {
    provider: delivery.provider,
    developmentOtp: delivery.provider === "development" ? otp : "",
  });
};

const verifyGoogleToken = async (token) => {
  try {
    const response = await axios.get("https://oauth2.googleapis.com/tokeninfo", {
      params: { id_token: token },
      timeout: 10000,
    });

    const data = response.data;
    if (!data?.email) {
      throw new Error("Google account email not available");
    }

    return {
      email: String(data.email).toLowerCase(),
      name: data.name || data.given_name || "Google User",
    };
  } catch {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });

    const data = response.data;
    if (!data?.email) {
      throw new Error("Google account email not available");
    }

    return {
      email: String(data.email).toLowerCase(),
      name: data.name || data.given_name || "Google User",
    };
  }
};

const verifyFacebookToken = async (token) => {
  const response = await axios.get("https://graph.facebook.com/me", {
    params: {
      fields: "id,name,email",
      access_token: token,
    },
    timeout: 10000,
  });

  const data = response.data;
  if (!data?.email) {
    throw new Error("Facebook account email permission is required");
  }

  return {
    email: String(data.email).toLowerCase(),
    name: data.name || "Facebook User",
  };
};

const issueAuthResponse = (user) => ({
  token: generateToken({ id: user._id, role: user.role }),
  user: sanitizeUser(user),
});

const findReusableSignupUser = async ({ email }) => {
  const existingByEmail = await User.findOne({ email });

  if (existingByEmail && existingByEmail.status === "deactivated") {
    return { blocked: true, message: "This email belongs to a deactivated account. Please contact support." };
  }

  if (existingByEmail && existingByEmail.isEmailVerified) {
    return { blocked: true, message: "Email already in use" };
  }

  return { user: existingByEmail || null };
};

const signup = async (req, res) => {
  const { name, email, password, phone, address, role = "buyer" } = req.body;

  const lookup = await findReusableSignupUser({ email });
  if (lookup.blocked) {
    return res.status(409).json({ message: lookup.message });
  }

  let user = lookup.user;

  if (!user) {
    user = new User({
      name,
      email,
      password,
      phone: phone ? String(phone).trim() : undefined,
      address,
      role,
      isPhoneVerified: false,
      isEmailVerified: false,
      ...buildFreeOnboardingPack(),
    });
  } else {
    user.name = name;
    user.email = email;
    user.password = password;
    if (phone) user.phone = String(phone).trim();
    user.address = address;
    user.role = role;
    user.canPostProperty = true;
    user.isPhoneVerified = false;
    user.isEmailVerified = false;
    Object.assign(user, buildFreeOnboardingPack());
  }

  clearOtpState(user);
  await user.save();

  const challenge = await createOtpChallenge(user, "email_signup");
  return res.status(202).json({
    ...challenge,
    message: "OTP sent to your email address. Verify to activate your account.",
  });
};

const login = async (req, res) => {
  const { email, phone, password } = req.body;

  let user = null;
  if (email) {
    user = await User.findOne({ email });
  } else if (phone) {
    const normalizedPhone = String(phone).trim().replace(/\D/g, "");
    const withCountry = normalizedPhone.length === 10 ? `91${normalizedPhone}` : normalizedPhone;
    user = await User.findOne({ phone: withCountry }) || await User.findOne({ phone: normalizedPhone });
  }

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.status === "deactivated") {
    return res.status(403).json({ message: "Your account has been deactivated by the admin." });
  }

  await ensureFreeOnboardingValidity(user);
  try {
    await sendLoginAlert(user);
    console.log(`[login] Login alert email sent to ${user.email}`);
  } catch (error) {
    console.error("[login] Login alert email failed:", error.message);
  }

  return res.json(issueAuthResponse(user));
};

const verifyOtp = async (req, res) => {
  const { challengeId, otp } = req.body;
  const user = await User.findOne({ "otpVerification.challengeId": challengeId });

  if (!user || !user.otpVerification?.challengeId) {
    return res.status(404).json({ message: "OTP challenge not found. Please request a new code." });
  }

  if (!user.otpVerification.expiresAt || new Date(user.otpVerification.expiresAt) < new Date()) {
    clearOtpState(user);
    await user.save();
    return res.status(410).json({ message: "OTP expired. Please request a new code." });
  }

  if ((user.otpVerification.attempts || 0) >= (user.otpVerification.maxAttempts || OTP_MAX_ATTEMPTS)) {
    clearOtpState(user);
    await user.save();
    return res.status(429).json({ message: "Too many invalid OTP attempts. Please request a new code." });
  }

  let otpMatches = false;
  otpMatches = user.otpVerification.codeHash === hashOtp(otp);

  if (!otpMatches) {
    user.otpVerification.attempts = (user.otpVerification.attempts || 0) + 1;
    await user.save();
    return res.status(401).json({ message: "Incorrect OTP. Please try again." });
  }

  const purpose = user.otpVerification.purpose;
  user.isEmailVerified = true;
  user.isPhoneVerified = true; // Keep legacy flag in sync
  user.otpVerification.verifiedAt = new Date();
  clearOtpState(user);
  await user.save();

  if (purpose === "signup" || purpose === "email_signup") {
    try {
      await sendWelcomeEmail(user, "signing up");
      console.log(`[signup] Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error("[signup] Welcome email failed:", error.message);
    }
  }

  if (purpose === "login") {
    try {
      await sendLoginAlert(user);
      console.log(`[login] Login alert email sent to ${user.email}`);
    } catch (error) {
      console.error("[login] Login alert email failed:", error.message);
    }
  }

  await ensureFreeOnboardingValidity(user);
  return res.json(issueAuthResponse(user));
};

const resendOtpCode = async (req, res) => {
  const { challengeId } = req.body;
  const user = await User.findOne({ "otpVerification.challengeId": challengeId });

  if (!user || !user.otpVerification?.challengeId) {
    return res.status(404).json({ message: "OTP challenge not found. Please start again." });
  }

  const resendAt = user.otpVerification.resendAvailableAt ? new Date(user.otpVerification.resendAvailableAt) : null;
  if (resendAt && resendAt > new Date()) {
    const secondsRemaining = Math.max(1, Math.ceil((resendAt.getTime() - Date.now()) / 1000));
    return res.status(429).json({ message: `Please wait ${secondsRemaining}s before requesting another OTP.` });
  }

  const challenge = await createOtpChallenge(user, user.otpVerification.purpose || "login");
  return res.status(202).json({
    ...challenge,
    message: "A fresh OTP has been sent.",
  });
};

const socialLogin = async (req, res) => {
  const { provider, token } = req.body;

  let verified;
  try {
    verified = provider === "google" ? await verifyGoogleToken(token) : await verifyFacebookToken(token);
  } catch (error) {
    return res.status(401).json({ message: error.message || "Invalid social token" });
  }

  let user = await User.findOne({ email: verified.email });
  if (user && user.status === "deactivated") {
    return res.status(403).json({ message: "Your account has been deactivated by the admin." });
  }

  const isNewUser = !user;

  if (!user) {
    user = await User.create({
      name: verified.name,
      email: verified.email,
      password: Math.random().toString(36).slice(2) + Date.now().toString(36),
      role: "buyer",
      canPostProperty: false,
      isPhoneVerified: false,
      ...buildFreeOnboardingPack(),
    });
  }

  if (isNewUser) {
    try {
      await sendWelcomeEmail(user, `signing up with ${provider}`);
      console.log(`[socialLogin] Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error("[socialLogin] Welcome email failed:", error.message);
    }
  }

  await ensureFreeOnboardingValidity(user);

  return res.json(issueAuthResponse(user));
};

const me = async (req, res) => {
  await ensureFreeOnboardingValidity(req.user);
  return res.json({ user: req.user });
};

module.exports = {
  signupValidators,
  loginValidators,
  socialLoginValidators,
  verifyOtpValidators,
  resendOtpValidators,
  signup,
  login,
  verifyOtp,
  resendOtpCode,
  socialLogin,
  me,
};
