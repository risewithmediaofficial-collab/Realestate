const axios = require("axios");

/**
 * MSG91 Email OTP Sender
 * Sends OTP via MSG91 Email API using the global_otp template.
 * Docs: https://control.msg91.com/api/v5/email/send
 */

const MSG91_EMAIL_AUTH_KEY = process.env.MSG91_EMAIL_AUTH_KEY || process.env.MSG91_AUTH_KEY || "";
const MSG91_EMAIL_FROM = process.env.MSG91_EMAIL_FROM || "";
const MSG91_EMAIL_DOMAIN = process.env.MSG91_EMAIL_DOMAIN || "";
const MSG91_EMAIL_TEMPLATE_ID = process.env.MSG91_EMAIL_TEMPLATE_ID || "global_otp";
const MSG91_EMAIL_ENDPOINT = "https://control.msg91.com/api/v5/email/send";

const hasMsg91EmailConfig = Boolean(
  MSG91_EMAIL_AUTH_KEY && MSG91_EMAIL_FROM && MSG91_EMAIL_DOMAIN
);

/**
 * Sends OTP email via MSG91.
 * @param {Object} opts
 * @param {string} opts.email      - Recipient email address
 * @param {string} opts.name       - Recipient display name
 * @param {string} opts.otp        - The OTP code to send
 * @param {string} [opts.purpose]  - Purpose label for logging
 * @returns {{ provider: string, delivered: boolean, response: any }}
 */
const sendEmailOtpViaMsg91 = async ({ email, name, otp }) => {
  const payload = {
    recipients: [
      {
        to: [
          {
            email,
            name: name || email,
          },
        ],
        variables: {
          company_name: "MyHosurProperty",
          otp,
        },
      },
    ],
    from: {
      email: MSG91_EMAIL_FROM,
    },
    domain: MSG91_EMAIL_DOMAIN,
    template_id: MSG91_EMAIL_TEMPLATE_ID,
  };

  const response = await axios.post(MSG91_EMAIL_ENDPOINT, payload, {
    headers: {
      authkey: MSG91_EMAIL_AUTH_KEY,
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

  return {
    provider: "msg91_email",
    delivered: true,
    response: response.data,
  };
};

/**
 * Main entry point.
 * Falls back to development/console mode when MSG91 email config is absent.
 */
const sendEmailOtp = async ({ email, name, otp, purpose }) => {
  if (!hasMsg91EmailConfig) {
    // Development fallback — log to console
    console.log(
      `[email-otp] Development OTP for ${email} (${purpose || "otp"}): ${otp}`
    );
    return {
      provider: "development",
      delivered: true,
      response: { message: "Email OTP generated in development fallback mode." },
    };
  }

  try {
    return await sendEmailOtpViaMsg91({ email, name, otp });
  } catch (error) {
    const status = error?.response?.status;
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message;

    console.error(
      `[email-otp] MSG91 email send failed (HTTP ${status || "?"}) — ${msg}`
    );

    const err = new Error(`Failed to send OTP email: ${msg}`);
    err.statusCode = 502;
    throw err;
  }
};

module.exports = {
  sendEmailOtp,
  hasMsg91EmailConfig,
};
