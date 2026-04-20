import { AlertOctagon, FileWarning, RefreshCcw, XCircle } from 'lucide-react';

type RejectedKycStatusProps = {
  status?: string;
  reason?: string | null;
  submittedAt?: string | null;
  onReapply?: () => void;
};

function formatSubmittedAt(submittedAt?: string | null) {
  if (!submittedAt) return null;
  const d = new Date(submittedAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function RejectedKycStatus({
  status = 'rejected',
  reason,
  submittedAt,
  onReapply,
}: RejectedKycStatusProps) {
  const formatted = formatSubmittedAt(submittedAt);

  return (
    <div className="  py-8 animate-in zoom-in-95 duration-300">
      <div className="bg-white rounded-2xl border border-red-100 p-8 shadow-sm space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl border border-red-100">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-1.5">
            <h1
              className="text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Application Rejected
            </h1>
            <p className="text-slate-500 text-sm">
              Unfortunately, your identity verification could not be completed.
            </p>
          </div>
        </div>

        {/* Reason Card */}
        <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-red-50/30">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <AlertOctagon className="w-24 h-24 text-red-900" />
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-red-600" />
              <span className="text-[0.7rem] font-bold text-red-700 uppercase tracking-widest">
                Rejection Detail
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                Reason for decision:
              </p>
              <p className="text-sm text-red-800 leading-relaxed italic">
                "
                {reason?.trim()
                  ? reason
                  : 'No specific reason provided by the registrar.'}
                "
              </p>
            </div>

            <div className="flex items-center gap-4 text-[0.7rem] text-red-600/70 pt-2 border-t border-red-100">
              <p>
                <span className="font-bold">Status:</span>{' '}
                {status.toUpperCase()}
              </p>
              {formatted && (
                <p>
                  <span className="font-bold">Submitted:</span> {formatted}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onReapply}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0"
          >
            <RefreshCcw className="w-4 h-4" />
            Correct & Re-apply
          </button>

          <button
            type="button"
            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Contact Support
          </button>
        </div>

        <p className="text-center text-[0.65rem] text-slate-400 leading-relaxed px-6">
          Please ensure all documents are clearly legible and match your profile
          details exactly to avoid further delays.
        </p>
      </div>
    </div>
  );
}
