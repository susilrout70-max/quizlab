/**
 * Centralized error normalization utility for QuizLab frontend.
 * Guarantees that any error (AxiosError, Error instance, API response object, network failure, or unknown)
 * is safely resolved to a clean, user-facing string so objects are NEVER passed as React children.
 */

export interface ApiErrorShape {
  error?: string | { code?: string; message?: string };
  message?: string;
  code?: string;
}

export function getErrorMessage(error: unknown, fallback: string = 'An unexpected error occurred. Please try again.'): string {
  if (!error) {
    return fallback;
  }

  // 1. Primitive string error
  if (typeof error === 'string') {
    return error.trim() || fallback;
  }

  // 2. Axios / HTTP Response Error
  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, any>;

    // Check response from server (AxiosError response)
    if (errObj.response) {
      const response = errObj.response;
      const data = response.data as ApiErrorShape | string | undefined;

      // Plain text response (HTML 500, nginx/vercel gateway page)
      if (typeof data === 'string') {
        if (data.includes('FUNCTION_INVOCATION_FAILED')) {
          return 'Service temporarily unavailable. Please try again in a few moments.';
        }
        return data.length < 200 ? data : `Request failed with status ${response.status}.`;
      }

      if (data && typeof data === 'object') {
        // Standardized shape: { error: { code, message } }
        if (data.error && typeof data.error === 'object' && typeof data.error.message === 'string') {
          return data.error.message;
        }

        // Legacy shape: { error: "Message string" }
        if (typeof data.error === 'string' && data.error.trim()) {
          return data.error;
        }

        // Alternative API shape: { message: "Message string" }
        if (typeof data.message === 'string' && data.message.trim()) {
          return data.message;
        }
      }

      // HTTP Status Code Fallbacks
      if (response.status === 400) {
        return 'Invalid request details. Please check your input and try again.';
      }
      if (response.status === 401) {
        return 'Invalid email or password. Please verify your credentials.';
      }
      if (response.status === 403) {
        return 'Access denied. You do not have permission for this action.';
      }
      if (response.status === 404) {
        return 'Requested endpoint or service could not be found.';
      }
      if (response.status === 409) {
        return 'An account with this email already exists. Please log in.';
      }
      if (response.status >= 500) {
        return 'QuizLab server is experiencing issues. Please try again in a moment.';
      }
    }

    // Network disconnection / timeout / DNS failure
    if (errObj.code === 'ECONNABORTED' || errObj.message?.toLowerCase().includes('timeout')) {
      return 'Request timed out. Please check your network connection and try again.';
    }

    if (errObj.message === 'Network Error' || !errObj.response && errObj.request) {
      return 'Unable to reach QuizLab server. Please check your internet connection.';
    }

    // Direct object with { code, message } (e.g. Vercel error payload)
    if (typeof errObj.message === 'string' && errObj.message.trim()) {
      return errObj.message;
    }
  }

  // 3. Standard JS Error
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

