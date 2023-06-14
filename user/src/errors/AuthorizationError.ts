import ClientError from './ClientError';

export default class AuthorizationError extends ClientError {
  constructor(message: string, details?: any) {
    super(message, details, 403);
    this.name = 'AuthorizationError';
  }
}
