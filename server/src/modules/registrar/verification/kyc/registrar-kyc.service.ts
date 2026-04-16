import { pool } from '@/infra/db/db.js';
import { getPresignedUrl } from '@/utils/r2-services.js';
import { withTransaction } from '@/utils/transaction.js';

import { fetchUsersKyc, insertIntoUserProfile, updateUserKyc } from './registrar-kyc.repository.js';

export const getKyc = async (userId: string, status: string) => {
  const kycs = await fetchUsersKyc(pool, userId, status);

  return Promise.all(
    kycs.map(async (kyc) => {
      const panDocumentUrl = await getPresignedUrl(kyc.pan_document_key);

      return {
        user_id: kyc.user_id,
        pan_name: kyc.pan_name,
        phone: kyc.phone,
        address: kyc.address,
        pincode: kyc.pincode,
        district: kyc.district,
        state: kyc.state,
        pan_document_url: panDocumentUrl,
      };
    }),
  );
};

export const approveKyc = async (userId: string, reviewerId: string) => {
  withTransaction(pool, async (client) => {
    const profileData = await updateUserKyc(client, userId, reviewerId);
    await insertIntoUserProfile(client, profileData);
  });
};
