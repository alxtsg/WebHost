import config from '../config.js';
import ErrorCode from '../errors/error-code.js';
import ErrorResponse from '../types/error-response.js';

export const BASE_URL = `http://127.0.0.1:${config.port}`;

export function isErrorResponse (value: any): value is ErrorResponse {
  if (typeof value !== 'object') {
    return false;
  }

  const validErrorCodes = Object.values(ErrorCode);

  return (value.hasOwnProperty('code') &&
    validErrorCodes.includes(value['code']) &&
    value.hasOwnProperty('message'));
}
