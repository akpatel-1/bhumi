interface ApiErrorOptions {
  message: string;
  statusCode: number;
  code: string;
}
export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(errorObj: ApiErrorOptions) {
    super(errorObj.message);

    this.statusCode = errorObj.statusCode;
    this.code = errorObj.code;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
