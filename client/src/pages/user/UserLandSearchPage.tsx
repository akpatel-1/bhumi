import { CheckCircle2 } from "lucide-react";

export default function UserLandSearchPage() {
  return (
    <div className="space-y-2">
     
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100   bg-linear-to-r from-emerald-100 via-white to-violet-50 p-5 mb-5 md:p-6 shadow-sm">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/60 blur-2xl" />
          <div className="relative space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Search Land
            </span>

            <p className="max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm">
              Search parcels by plot ID, owner, or location metadata.
            </p>
          </div>
    </div>
    </div>
  );
}
