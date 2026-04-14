import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { router } from './index.js';
import { globalErrorHandler } from './modules/error-handler-middleware.js';

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(globalErrorHandler);
