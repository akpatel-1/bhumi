import { pool } from '@/infra/db/db.js';
import { ERROR_CONFIG } from '@/modules/error-config.js';
import { ApiError } from '@/utils/api-error.js';
import { getPresignedUrl } from '@/utils/r2-services.js';
import { withTransaction } from '@/utils/transaction.js';

import {
  fetchUsersKyc,
  insertIntoUserProfile,
  markKycAsApproved,
  markKycAsRejected,
} from './registrar-kyc.repository.js';

export type KycStatus = 'pending' | 'approved' | 'rejected';

export const getKyc = async (userId: string, status: KycStatus) => {
  const kycs = await fetchUsersKyc(pool, userId, status);

  return Promise.all(
    kycs.map(async (kyc) => {
      const panDocumentUrl = await getPresignedUrl(kyc.pan_document_key);

      const baseKyc = {
        user_id: kyc.user_id,
        pan_name: kyc.pan_name,
        phone: kyc.phone,
        address: kyc.address,
        pincode: kyc.pincode,
        district: kyc.district,
        state: kyc.state,
        pan_document_url: panDocumentUrl,
      };

      if (status === 'rejected') {
        return {
          ...baseKyc,
          rejection_reason: kyc.rejection_reason,
        };
      }

      return baseKyc;
    }),
  );
};

export const approveKyc = async (userId: string, reviewerId: string) => {
  withTransaction(pool, async (client) => {
    const profileData = await markKycAsApproved(client, userId, reviewerId);
    await insertIntoUserProfile(client, profileData);
  });
};

export const rejectKyc = async (userId: string, reviewerId: string, rejectionReason: string) => {
  const updated = await markKycAsRejected(pool, userId, reviewerId, rejectionReason);
  if (!updated) {
    throw new ApiError(ERROR_CONFIG.KYC_NOT_FOUND);
  }
};
