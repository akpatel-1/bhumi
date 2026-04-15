import 'dotenv/config';
import { Resend } from 'resend';

import { env } from '@/config/env.js';

const resend = new Resend(env.emailApi);

export default resend;
