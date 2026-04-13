import type { Response } from 'express';

type SendResponseOptions<TData> = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: TData | null;
};

export const sendResponse = <TData = unknown>(
  res: Response,
  {
    statusCode = 200,
    success = true,
    message = 'Success',
    data = null,
  }: SendResponseOptions<TData>,
): Response => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};
