import ClientError from './ClientError';

export default class NotFoundError extends ClientError {
  constructor(message: string, details?: any) {
    super(message, details, 404);
    this.name = 'NotFoundError';
  }
}
