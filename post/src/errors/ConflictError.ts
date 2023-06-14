import ClientError from './ClientError';

export default class ConflictError extends ClientError {
  constructor(message: string, details?: any) {
    super(message, details, 409);
    this.name = 'ConflictError';
  }
}
