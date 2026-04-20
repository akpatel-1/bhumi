type ApprovedKycStatusProps = {
  submittedAt?: string | null;
};

function formatSubmittedAt(submittedAt?: string | null) {
  if (!submittedAt) return null;
  const d = new Date(submittedAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString();
}

export default function ApprovedKycStatus({
  submittedAt,
}: ApprovedKycStatusProps) {
  const formatted = formatSubmittedAt(submittedAt);

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-slate-900">KYC Approved</h1>
      <p className="text-slate-600">
        Your identity has been verified. You can now access land registry
        features.
      </p>
      {formatted && (
        <p className="text-sm text-slate-500">Submitted at: {formatted}</p>
      )}
    </div>
  );
}
