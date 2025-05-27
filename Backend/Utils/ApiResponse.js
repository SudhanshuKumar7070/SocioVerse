class ApiResponse {
  constructor(statusCode, response,message = "success", data) {
    this.statusCode = statusCode;
    this.message = message;
    this.response = response;
    this.data = statusCode < 400;
  }
};
 export { ApiResponse};
