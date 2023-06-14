import ClientError from './ClientError';

export default class BadRequestError extends ClientError {
  constructor(message: string, details?: any) {
    super(message, details);
    this.name = 'BadRequestError';
  }
}
