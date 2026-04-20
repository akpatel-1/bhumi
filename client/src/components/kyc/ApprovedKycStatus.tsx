import { Link } from 'react-router-dom';

import {
  ArrowRight,
  CheckCircle,
  PartyPopper,
  ShieldCheck,
} from 'lucide-react';

type ApprovedKycStatusProps = {
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

export default function ApprovedKycStatus({
  submittedAt,
}: ApprovedKycStatusProps) {
  const formatted = formatSubmittedAt(submittedAt);

  return (
    <div className="mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-2xl border border-emerald-100 p-8 shadow-sm text-center space-y-8 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60" />

        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-20" />
            <div className="relative flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full border-2 border-emerald-100">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1
              className="text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Identity Verified
            </h1>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
              Great news! Your KYC has been approved. You now have full access
              to the land registry features.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">
              Verified Profile
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <PartyPopper className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">
              Unlocked Registry
            </span>
          </div>
        </div>

        {/* Primary Action */}
        <div className="space-y-4 pt-2">
          <Link
            to="/user/registry"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0"
          >
            Go to Land Registry
            <ArrowRight className="w-4 h-4" />
          </Link>

          {formatted && (
            <p className="text-[0.7rem] font-medium text-slate-400 uppercase tracking-widest">
              Verification completed for submission on {formatted}
            </p>
          )}
        </div>

        {/* Security Footer */}
        <div className="pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-emerald-600/60">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[0.6rem] font-bold uppercase tracking-widest">
            Bhumi Certified Account
          </span>
        </div>
      </div>
    </div>
  );
}
