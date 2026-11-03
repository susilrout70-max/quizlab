import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Import the normalized error helper logic (identical to client/src/lib/error.ts)
export function getErrorMessage(error, fallback = 'An unexpected error occurred. Please try again.') {
  if (!error) return fallback;
  if (typeof error === 'string') return error.trim() || fallback;

  if (typeof error === 'object' && error !== null) {
    const errObj = error;

    if (errObj.response) {
      const response = errObj.response;
      const data = response.data;

      if (typeof data === 'string') {
        if (data.includes('FUNCTION_INVOCATION_FAILED')) {
          return 'Service temporarily unavailable. Please try again in a few moments.';
        }
        return data.length < 200 ? data : `Request failed with status ${response.status}.`;
      }

      if (data && typeof data === 'object') {
        if (data.error && typeof data.error === 'object' && typeof data.error.message === 'string') {
          return data.error.message;
        }
        if (typeof data.error === 'string' && data.error.trim()) {
          return data.error;
        }
        if (typeof data.message === 'string' && data.message.trim()) {
          return data.message;
        }
      }

      if (response.status === 400) return 'Invalid request details. Please check your input and try again.';
      if (response.status === 401) return 'Invalid email or password. Please verify your credentials.';
      if (response.status === 403) return 'Access denied. You do not have permission for this action.';
      if (response.status === 404) return 'Requested endpoint or service could not be found.';
      if (response.status === 409) return 'An account with this email already exists. Please log in.';
      if (response.status >= 500) return 'QuizLab server is experiencing issues. Please try again in a moment.';
    }

    if (errObj.code === 'ECONNABORTED' || errObj.message?.toLowerCase().includes('timeout')) {
      return 'Request timed out. Please check your network connection and try again.';
    }

    if (errObj.message === 'Network Error' || (!errObj.response && errObj.request)) {
      return 'Unable to reach QuizLab server. Please check your internet connection.';
    }

    if (typeof errObj.message === 'string' && errObj.message.trim()) {
      return errObj.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

describe('Frontend Error Normalization Tests (getErrorMessage)', () => {
  test('CRITICAL: Never returns a raw object when given { code, message } error (the React #31 bug)', () => {
    // This is the EXACT shape returned by Vercel/backend that triggered Minified React error #31
    const rawErrorObject = {
      response: {
        status: 500,
        data: {
          error: {
            code: 'FUNCTION_INVOCATION_FAILED',
            message: 'A serverless function crashed during execution',
          },
        },
      },
    };

    const result = getErrorMessage(rawErrorObject);
    assert.equal(typeof result, 'string', 'Result MUST always be a string, never an object');
    assert.equal(result, 'A serverless function crashed during execution');
  });

  test('Extracts string from standardized API error { error: { code, message } }', () => {
    const apiError = {
      response: {
        status: 401,
        data: {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        },
      },
    };

    const result = getErrorMessage(apiError);
    assert.equal(result, 'Invalid email or password');
  });

  test('Extracts string from legacy API error { error: string }', () => {
    const legacyError = {
      response: {
        status: 400,
        data: {
          error: 'Password must be at least 6 characters',
        },
      },
    };

    const result = getErrorMessage(legacyError);
    assert.equal(result, 'Password must be at least 6 characters');
  });

  test('Handles network error without response (e.g. offline, DNS failure)', () => {
    const networkError = {
      message: 'Network Error',
      request: {},
    };

    const result = getErrorMessage(networkError);
    assert.equal(result, 'Unable to reach QuizLab server. Please check your internet connection.');
  });

  test('Handles request timeout', () => {
    const timeoutError = {
      code: 'ECONNABORTED',
      message: 'timeout of 5000ms exceeded',
    };

    const result = getErrorMessage(timeoutError);
    assert.equal(result, 'Request timed out. Please check your network connection and try again.');
  });

  test('Handles non-JSON HTML 500 response from gateway', () => {
    const html500 = {
      response: {
        status: 500,
        data: 'An error occurred with your deployment: FUNCTION_INVOCATION_FAILED',
      },
    };

    const result = getErrorMessage(html500);
    assert.equal(result, 'Service temporarily unavailable. Please try again in a few moments.');
  });

  test('Handles arbitrary unknown objects safely', () => {
    const unknownError = { randomKey: 12345, anotherNested: { a: 1 } };
    const result = getErrorMessage(unknownError);
    assert.equal(typeof result, 'string');
    assert.equal(result, 'An unexpected error occurred. Please try again.');
  });

  test('Handles null, undefined, and empty inputs with fallback', () => {
    assert.equal(getErrorMessage(null), 'An unexpected error occurred. Please try again.');
    assert.equal(getErrorMessage(undefined), 'An unexpected error occurred. Please try again.');
    assert.equal(getErrorMessage(null, 'Custom fallback'), 'Custom fallback');
  });
});
