const User = require("../models/User");

const ADMIN_NAME = process.env.ADMIN_NAME || "admin4";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin4@myhosurproperty.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin4";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "9688235536";

const normalizePhoneForStorage = (phone) => {
  if (!phone) return null;
  const cleaned = String(phone).trim().replace(/\D/g, "");
  return cleaned.length === 10 ? `91${cleaned}` : cleaned;
};

const ensureAdminSeeded = async () => {
  try {
    const normalizedPhone = normalizePhoneForStorage(ADMIN_PHONE);
    let user = await User.findOne({ email: ADMIN_EMAIL });

    if (!user) {
      user = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        canPostProperty: true,
        phone: normalizedPhone,
      });
      console.log(`[boot] Admin user created: ${user.email}`);
    } else {
      user.name = ADMIN_NAME;
      user.role = "admin";
      user.canPostProperty = true;
      user.password = ADMIN_PASSWORD;
      user.phone = normalizedPhone;
      await user.save();
      console.log(`[boot] Admin user updated: ${user.email} with phone ${normalizedPhone}`);
    }
  } catch (error) {
    console.error("[boot] Failed to ensure admin seeded:", error.message);
  }
};

module.exports = ensureAdminSeeded;
