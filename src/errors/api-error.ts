import type ErrorCode from './error-code.js';

class APIError extends Error {
  code = '';
  statusCode = 0;

  constructor(statusCode: number, code: ErrorCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export default APIError;
