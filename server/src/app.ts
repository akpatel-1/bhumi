import { globalErrorHandler } from '@modules/error-handler-middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { env } from '@/config/env.js';
import { router } from '@/index.js';

export const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(globalErrorHandler);
