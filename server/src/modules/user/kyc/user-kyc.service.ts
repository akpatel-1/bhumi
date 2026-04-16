import { pool } from '@/infra/db/db.js';
import { ApiError } from '@/utils/api-error.js';
import { deleteFromR2, uploadToR2 } from '@/utils/r2-services.js';
import { withTransaction } from '@/utils/transaction.js';

import { findUserKycByUserId, insertIntoUserKyc } from './user-kyc.repository.js';

interface KycData {
  pan_name: string;
  phone: string;
  address: string;
  pincode: string;
  district: string;
  state: string;
  pan_number: string;
}

export const submitKyc = async (data: KycData, file: Express.Multer.File, userId: string) => {
  const existing = await findUserKycByUserId(pool, userId);
  if (existing && existing.status !== 'rejected') {
    throw new ApiError({
      statusCode: 409,
      message: `A KYC request already exists with status "${existing.status}".`,
      code: 'KYC_ALREADY_APPLIED',
    });
  }
  const documentKey = await uploadToR2(userId, file, 'user_kyc');
  try {
    await insertIntoUserKyc(pool, userId, data, documentKey);
  } catch {
    await deleteFromR2(documentKey);
  }
};

export const kycStatus = async (userId: string) => {
  return await findUserKycByUserId(pool, userId);
};
