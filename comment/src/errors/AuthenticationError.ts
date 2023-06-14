import ClientError from './ClientError';

export default class AuthenticationError extends ClientError {
  constructor(message: string, details?: any) {
    super(message, details, 401);
    this.name = 'AuthenticationError';
  }
}
