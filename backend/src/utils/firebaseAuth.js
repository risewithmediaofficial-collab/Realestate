const axios = require("axios");
const jwt = require("jsonwebtoken");

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "myhosurproperty-71d00";
const CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let cachedCerts = null;
let cachedCertsExpiresAt = 0;

const getFirebaseCerts = async () => {
  if (cachedCerts && cachedCertsExpiresAt > Date.now()) {
    return cachedCerts;
  }

  const response = await axios.get(CERTS_URL, { timeout: 10000 });
  const cacheControl = response.headers["cache-control"] || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeSeconds = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;

  cachedCerts = response.data;
  cachedCertsExpiresAt = Date.now() + maxAgeSeconds * 1000;

  return cachedCerts;
};

const verifyFirebaseIdToken = async (idToken) => {
  const decodedHeader = jwt.decode(idToken, { complete: true });
  const kid = decodedHeader?.header?.kid;

  if (!kid) {
    const error = new Error("Invalid Firebase verification token.");
    error.statusCode = 401;
    throw error;
  }

  const certs = await getFirebaseCerts();
  const publicKey = certs[kid];

  if (!publicKey) {
    const error = new Error("Firebase verification token is not recognized.");
    error.statusCode = 401;
    throw error;
  }

  return jwt.verify(idToken, publicKey, {
    algorithms: ["RS256"],
    audience: FIREBASE_PROJECT_ID,
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
  });
};

module.exports = {
  verifyFirebaseIdToken,
};
