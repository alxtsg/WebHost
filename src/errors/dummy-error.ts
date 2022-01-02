import APIError from './api-error.js';

class DummyError extends APIError {
  constructor(message: string) {
    super(418, message);
  }
}

export default DummyError;
