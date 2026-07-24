// Ensures every endpoint replies with the same envelope shape:
// { success, message, data }. Consumers (admin panel, public site) can rely
// on this without per-endpoint special-casing.
class ApiResponse {
  constructor(statusCode, data = null, message = 'Success') {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  send(res, statusCode = 200) {
    return res.status(statusCode).json(this);
  }
}

module.exports = ApiResponse;
