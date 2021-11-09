//generating api key
const hashAPIKey = (apiKey) => {
  const { createHash } = require("crypto");

  const hashedAPIKey = createHash("sha256").update(apiKey).digest("hex");

  return hashedAPIKey;
};
//generating hash for api

const generateAPIKey = () => {
  const { apiKeys } = require("./customers");
  const { randomBytes } = require("crypto");
  const apiKey = randomBytes(16).toString("hex");
  const hashedAPIKey = hashAPIKey(apiKey);

  // Ensure API key is unique
  if (apiKeys[hashedAPIKey]) {
    generateAPIKey();
  } else {
    return { hashedAPIKey, apiKey };
  }
};

module.exports = {
  hashAPIKey: hashAPIKey,
  generateAPIKey: generateAPIKey,
};
