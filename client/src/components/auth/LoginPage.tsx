import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  AuthRole,
  LoginPayload,
  SessionUser,
} from '@/types/admin/auth.types';

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';

interface FormData {
  email: string;
  password: string;
}

type LoginPageProps = {
  role: AuthRole;
  user?: SessionUser | null;
  onSubmit: (payload: LoginPayload) => Promise<void>;
};

const ROLE_META: Record<
  AuthRole,
  {
    label: string;
    headline: string;
    subtitle: string;
    notice: string;
    emailLabel: string;
    submitLabel: string;
  }
> = {
  admin: {
    label: 'Admin Access',
    headline: 'Admin Sign In',
    subtitle: 'Restricted access for platform administrators.',
    notice: 'Admin portal access is audited. Keep credentials confidential.',
    emailLabel: 'Admin email',
    submitLabel: 'Access Admin Portal',
  },
  registrar: {
    label: 'Registrar Access',
    headline: 'Registrar Sign In',
    subtitle: 'Access for enrolment and records management staff.',
    notice:
      'Registrar actions are recorded for compliance and operational review.',
    emailLabel: 'Registrar email',
    submitLabel: 'Access Registrar Portal',
  },
};

export default function LoginPage({
  role,
  user = null,
  onSubmit,
}: LoginPageProps) {
  const navigate = useNavigate();
  const roleMeta = ROLE_META[role];
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(
    null
  );

  useEffect(() => {
    if (role === 'admin' && user?.role === 'admin') {
      navigate('/admin/overview', { replace: true });
    }
  }, [navigate, role, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setFeedback('');
    setFeedbackType(null);
    setIsLoading(true);

    try {
      await onSubmit({ ...formData, email: formData.email.trim() });
      setFeedback('Authenticated successfully. Redirecting...');
      setFeedbackType('success');
    } catch {
      setFeedback('Invalid credentials or role mismatch. Please try again.');
      setFeedbackType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 bg-[#f8f7f4]">
        {/* Background Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 39px,#000 39px,#000 40px), repeating-linear-gradient(90deg,transparent,transparent 39px,#000 39px,#000 40px)',
          }}
        />

        <div className="relative z-10 w-full max-w-105 animate-fade-up">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-emerald-700">
              {roleMeta.label}
            </span>
            <h1
              className="mb-1.5 mt-3 text-[2rem] font-bold leading-tight text-slate-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {roleMeta.headline}
            </h1>
            <p className="text-sm text-slate-500">{roleMeta.subtitle}</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[0.78rem] font-semibold tracking-tight text-slate-700"
              >
                {roleMeta.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@bhumi.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 bg-white text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-violet-500/20 border-slate-200 focus:border-violet-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[0.78rem] font-semibold tracking-tight text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm outline-none transition-all duration-200 bg-white text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-violet-500/20 border-slate-200 focus:border-violet-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[1.1rem] hover:text-violet-500 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 rounded-xl text-sm font-semibold text-white
                bg-slate-900 hover:bg-slate-800
                shadow-[0_4px_14px_rgba(15,23,42,0.25)] hover:shadow-[0_6px_22px_rgba(15,23,42,0.35)]
                hover:-translate-y-px active:translate-y-0
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  {roleMeta.submitLabel}
                  <ArrowRight className="ml-0.5 h-4 w-4" />
                </>
              )}
            </button>

            {feedback ? (
              <p
                className={`rounded-xl border px-3.5 py-2.5 text-xs ${
                  feedbackType === 'error'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {feedback}
              </p>
            ) : null}
          </form>

          {/* Security Notice */}
          <div className="mt-7 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 border-amber-200/70 bg-amber-50">
            <ShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[0.72rem] leading-relaxed text-amber-700">
              {roleMeta.notice}
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[0.72rem] text-slate-400">
            © {new Date().getFullYear()} Bhumi Technologies. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
