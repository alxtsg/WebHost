class APIError extends Error {
  statusCode = 0;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default APIError;
