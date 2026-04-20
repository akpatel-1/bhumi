import { Clock, Info, ShieldCheck } from 'lucide-react';

type PendingKycStatusProps = {
  submittedAt?: string | null;
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

export default function PendingKycStatus({
  submittedAt,
}: PendingKycStatusProps) {
  const formatted = formatSubmittedAt(submittedAt);

  return (
    <div className="mx-auto py-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-20" />
          <div className="relative flex items-center justify-center w-20 h-20 bg-amber-50 rounded-full border border-amber-100">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <div className="space-y-3">
          <h1
            className="text-3xl font-bold text-slate-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Verification in Progress
          </h1>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            Your documents are currently being reviewed by our compliance team.
            This process typically takes 24–48 hours.
          </p>
        </div>

        {formatted && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <span className="w-2 h-2 bg-slate-400 rounded-full" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Submitted on {formatted}
            </p>
          </div>
        )}

        <div className="pt-6 border-t border-slate-50">
          <div className="flex items-start gap-3 text-left p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>What's next?</strong> While we verify your identity, you
              can explore the platform features, but land registration will
              remain locked.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-widest">
            Secured by Bhumi Tech
          </span>
        </div>
      </div>
    </div>
  );
}
