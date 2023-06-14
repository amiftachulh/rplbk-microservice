export function successResponse(message: string, data?: any) {
  return {
    status: 'success',
    message,
    data,
  };
}

export function errorResponse(message: string, error?: any) {
  return {
    status: 'error',
    message,
    error,
  };
}
