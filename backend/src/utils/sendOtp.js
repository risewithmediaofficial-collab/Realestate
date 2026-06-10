const axios = require("axios");

const OTP_PROVIDER = (process.env.OTP_PROVIDER || "auto").toLowerCase();
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || "";
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID || "";
const MSG91_ENDPOINT = process.env.MSG91_OTP_ENDPOINT || "https://control.msg91.com/api/v5/otp";

const hasMsg91Config = Boolean(MSG91_AUTH_KEY && MSG91_TEMPLATE_ID);

const sendOtpViaMsg91 = async ({ phoneNumber, otp }) => {
  const response = await axios.post(
    MSG91_ENDPOINT,
    {
      mobile: phoneNumber,
      otp,
      template_id: MSG91_TEMPLATE_ID,
      realTimeResponse: "1",
    },
    {
      headers: {
        authkey: MSG91_AUTH_KEY,
        "Content-Type": "application/json",
      },
      timeout: 12000,
    }
  );

  return {
    provider: "msg91",
    delivered: true,
    response: response.data,
  };
};

const sendOtp = async ({ phoneNumber, otp, purpose }) => {
  const wantsMsg91 = OTP_PROVIDER === "msg91";
  const canUseMsg91 = hasMsg91Config;

  if (wantsMsg91 && !canUseMsg91) {
    const error = new Error("MSG91 OTP provider is enabled but not configured.");
    error.statusCode = 500;
    throw error;
  }

  if (canUseMsg91) {
    return sendOtpViaMsg91({ phoneNumber, otp, purpose });
  }

  console.log(`[otp] Development OTP for ${phoneNumber} (${purpose}): ${otp}`);

  return {
    provider: "development",
    delivered: true,
    response: { message: "OTP generated in development fallback mode." },
  };
};

module.exports = {
  sendOtp,
  hasMsg91Config,
};
