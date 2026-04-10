import express from 'express';

import { router } from './index.js';
import { globalErrorHandler } from './module/error-handler-middleware.js';

export const app = express();

app.use(express.json());

app.use(router);

app.use(globalErrorHandler);
