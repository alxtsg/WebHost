import APIError from './api-error.js';
import ErrorCode from './error-code.js';

class DummyError extends APIError {
  constructor(message: string) {
    super(418, ErrorCode.DummyError, message);
  }
}

export default DummyError;
