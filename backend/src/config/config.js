const ENV = process.env.NODE_ENV;
const HOST = process.env.HOST;
const API_PORT = process.env.PORT || 3300;
const API_HOST = `${HOST}:${API_PORT}`;
const API_VERSION = "/api/v1";
const API_URL = `${API_HOST}${API_VERSION}`;

module.exports = {
  ENV,
  API_VERSION,
  API_URL,
  API_PORT,
};
