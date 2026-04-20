import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useRegistrarKycStore } from '@/store/registrar/registrar.kyc.store';
import type { RegistrarKycStatus } from '@/types/registrar/registrar.kyc.types';

import { ChevronDown, FileText, RefreshCcw } from 'lucide-react';

function isKycStatus(value: string | null): value is RegistrarKycStatus {
  return value === 'pending' || value === 'approved' || value === 'rejected';
}

function DocumentThumb({ url }: { url: string }) {
  const [isImageOk, setIsImageOk] = useState(true);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-3"
    >
      {isImageOk && (
        <img
          src={url}
          alt="Document preview"
          className="h-12 w-16 rounded-lg border border-slate-200 bg-white object-cover"
          loading="lazy"
          onError={() => setIsImageOk(false)}
        />
      )}
      <span className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline">
        <FileText className="h-4 w-4" /> {isImageOk ? 'Open' : 'Open Document'}
      </span>
    </a>
  );
}

function DocumentCard({ url }: { url: string }) {
  const [isImageOk, setIsImageOk] = useState(true);

  return (
    <div className="w-full max-w-md space-y-3">
      {isImageOk && (
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <img
            src={url}
            alt="Document"
            className="h-56 w-full rounded-lg bg-slate-50 object-contain"
            loading="lazy"
            onError={() => setIsImageOk(false)}
          />
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
      >
        <FileText className="h-4 w-4" />{' '}
        {isImageOk ? 'Open Full Image' : 'Open Document'}
      </a>
    </div>
  );
}

export default function RegistrarUserKycPage() {
  const [searchParams] = useSearchParams();
  const fetchUsers = useRegistrarKycStore((s) => s.fetchUsers);
  const approve = useRegistrarKycStore((s) => s.approve);
  const reject = useRegistrarKycStore((s) => s.reject);

  const statusParam = searchParams.get('status');
  const status: RegistrarKycStatus = isKycStatus(statusParam)
    ? statusParam
    : 'pending';

  const cache = useRegistrarKycStore((s) => s.byStatus[status]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const rows = useMemo(() => cache.data ?? [], [cache.data]);

  useEffect(() => {
    void fetchUsers(status);
  }, [fetchUsers, status]);

  useEffect(() => {
    setExpandedId(null);
  }, [status]);

  const onApprove = async (userId: string) => {
    setApprovingId(userId);
    try {
      await approve(userId);
    } finally {
      setApprovingId(null);
    }
  };

  const openReject = (userId: string) => {
    setRejectingId(userId);
    setRejectReason('');
  };

  const closeReject = () => {
    setRejectingId(null);
    setRejectReason('');
  };

  const onConfirmReject = async () => {
    if (!rejectingId) return;
    try {
      await reject(rejectingId, rejectReason);
      closeReject();
    } catch {
      // store already sets error
    }
  };

  return (
    <div className="space-y-6">
      {cache.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {cache.error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900">
                {status === 'pending'
                  ? 'Pending Review'
                  : status === 'approved'
                    ? 'Approved KYCs'
                    : 'Rejected KYCs'}
              </p>
              <p className="text-xs text-slate-500">
                {rows.length} record{rows.length === 1 ? '' : 's'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void fetchUsers(status, { force: true })}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              disabled={cache.isLoading}
            >
              <RefreshCcw
                className={'h-4 w-4 ' + (cache.isLoading ? 'animate-spin' : '')}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="stable-scrollbar-gutter overflow-x-auto overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/60 text-left">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="w-8 px-6 py-3"></th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Pincode</th>
                <th className="px-6 py-3">District</th>
                <th className="px-6 py-3">State</th>
                <th className="px-6 py-3">Document</th>
                {status === 'pending' && (
                  <th className="px-6 py-3 text-right">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 && !cache.isLoading ? (
                <tr>
                  <td
                    colSpan={status === 'pending' ? 9 : 8}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No {status} requests.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <>
                    <tr
                      key={row.user_id}
                      className={`cursor-pointer transition-colors ${
                        expandedId === row.user_id
                          ? 'bg-blue-50 hover:bg-blue-100/70'
                          : 'hover:bg-slate-50/40'
                      }`}
                      onClick={() =>
                        setExpandedId((current) =>
                          current === row.user_id ? null : row.user_id
                        )
                      }
                    >
                      <td className="relative px-4 py-4">
                        {expandedId === row.user_id && (
                          <span
                            className="absolute left-0 top-0 h-full w-1 rounded-r bg-blue-500"
                            aria-hidden="true"
                          />
                        )}
                        <ChevronDown
                          className={
                            'h-5 w-5 text-slate-400 transition-transform ' +
                            (expandedId === row.user_id ? 'rotate-180' : '')
                          }
                        />
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {row.pan_name}
                      </td>
                      <td className="px-6 py-4 text-slate-700">{row.phone}</td>
                      <td className="px-6 py-4 text-slate-700">
                        <span className="block max-w-xs truncate">
                          {row.address || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {row.pincode || '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {row.district}
                      </td>
                      <td className="px-6 py-4 text-slate-700 capitalize">
                        {row.state}
                      </td>
                      <td className="px-6 py-4">
                        {row.pan_document_url ? (
                          <DocumentThumb url={row.pan_document_url} />
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {status === 'pending' && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                void onApprove(row.user_id);
                              }}
                              disabled={approvingId === row.user_id}
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                            >
                              {approvingId === row.user_id
                                ? 'Approving…'
                                : 'Approve'}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openReject(row.user_id);
                              }}
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>

                    {expandedId === row.user_id && (
                      <tr>
                        <td colSpan={status === 'pending' ? 9 : 8}>
                          <div className="px-6 py-6 bg-slate-50/50">
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {(
                                  [
                                    { label: 'PAN Name', value: row.pan_name },
                                    { label: 'Phone', value: row.phone },
                                    { label: 'Address', value: row.address },
                                    { label: 'Pincode', value: row.pincode },
                                    { label: 'District', value: row.district },
                                    { label: 'State', value: row.state },
                                  ] as const
                                ).map((item) => (
                                  <div
                                    key={item.label}
                                    className="rounded border border-slate-200 bg-white p-3 shadow-sm"
                                  >
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                      {item.label}
                                    </p>
                                    <div className="text-sm font-medium wrap-break-words text-slate-900">
                                      {item.value || '-'}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div className="px-6 py-4">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Document
                                  </p>
                                </div>

                                <div className="px-6 pb-5">
                                  {row.pan_document_url ? (
                                    <DocumentCard url={row.pan_document_url} />
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </div>
                              </div>

                              {status === 'rejected' &&
                                row.rejection_reason && (
                                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <p className="mb-2 text-sm font-semibold text-red-900">
                                      Rejection Reason
                                    </p>
                                    <p className="text-sm text-red-700">
                                      {row.rejection_reason}
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <p className="text-sm font-semibold text-slate-900">Reject KYC</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide a reason for rejection.
              </p>
            </div>

            <div className="px-6 py-4 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Rejection reason
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="e.g. Document not clear"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
              <button
                type="button"
                onClick={closeReject}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void onConfirmReject()}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirm reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
