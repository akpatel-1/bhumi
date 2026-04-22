import { pool } from '@/infra/db/db.js';
import { ApiError } from '@/utils/api-error.js';
import { deleteFromR2, uploadToR2 } from '@/utils/r2-services.js';

import { findUserKycByUserId, insertIntoUserKyc } from './user-kyc.repository.js';

interface KycData {
  pan_name: string;
  phone: string;
  address: string;
  pincode: string;
  district: string;
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
  const documentKey = await uploadToR2(userId, file, 'users_kyc');
  try {
    await insertIntoUserKyc(pool, userId, data, documentKey);
  } catch {
    await deleteFromR2(documentKey);
    throw new ApiError({
      statusCode: 500,
      message: 'Unable to submit KYC at the moment.',
      code: 'KYC_SUBMIT_FAILED',
    });
  }
};

export const kycStatus = async (userId: string) => {
  const data = await findUserKycByUserId(pool, userId);
  if (!data) {
    return { state: 'not_applied' };
  }
  return data;
};
