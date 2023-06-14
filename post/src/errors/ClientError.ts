export default class ClientError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, details?: any, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ClientError';
  }
}
