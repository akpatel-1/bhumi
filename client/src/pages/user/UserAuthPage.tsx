import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { userAuthStore } from '@/store/user/user.auth.store';

import axios from 'axios';
import {
  AlertTriangle,
  Blocks,
  Database,
  Landmark,
  MapPinned,
  ShieldCheck,
} from 'lucide-react';

/* ── shared primitives ── */
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7b7367] mb-2">
    {children}
  </label>
);

const ErrorBox = ({ msg }: { msg: string }) =>
  msg ? (
    <div className="flex items-center gap-2 p-3 mb-5 bg-[#fff1f1] border border-[#f0caca] rounded-xl text-[#b63c3c] text-sm">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>{msg}</span>
    </div>
  ) : null;

const SubmitBtn = ({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#ffaf52] text-[#101010] font-display font-bold text-sm transition-colors hover:bg-[#ffa73f] disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading ? loadingLabel : label}
  </button>
);

type UserAuthProps = {
  onSuccess?: () => void;
};

export default function UserAuthPage({ onSuccess }: UserAuthProps) {
  const navigate = useNavigate();
  const requestOtp = userAuthStore((state) => state.requestOtp);
  const resendOtp = userAuthStore((state) => state.resendOtp);
  const verifyOtp = userAuthStore((state) => state.verifyOtp);
  const checkSessionCache = userAuthStore((state) => state.checkSessionCache);

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    let cancelled = false;

    const verifyExistingSession = async () => {
      const isVerified = await checkSessionCache();

      if (cancelled || !isVerified) return;

      const redirectTo = searchParams.get('redirect');
      navigate(redirectTo || '/user/overview');
    };

    verifyExistingSession();

    return () => {
      cancelled = true;
    };
  }, [checkSessionCache, navigate, searchParams]);

  useEffect(() => {
    if (step !== 'otp') return;
    inputRefs.current[0]?.focus();
    inputRefs.current[0]?.select();
  }, [step]);

  const clearError = () => setServerError('');
  const resetOtp = () => {
    setOtp(Array(6).fill(''));
    clearError();
  };

  const getNormalizedEmail = () => email.trim();
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  /* ── API handlers ── */
  const handleSendOtp = async () => {
    clearError();

    const normalizedEmail = getNormalizedEmail();

    if (!normalizedEmail) {
      setServerError('Please enter your email address');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setServerError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await requestOtp({ email: normalizedEmail });
      setEmail(normalizedEmail);
      setStep('otp');
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || err.response?.status === 500) {
        navigate('/error/500');
        return;
      }
      setServerError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (step === 'email') {
      await handleSendOtp();
      return;
    }

    if (otp.some((d) => d === '')) {
      setServerError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const otpString = otp.join('');
      await verifyOtp({ email: getNormalizedEmail(), otp: otpString });

      if (onSuccess) {
        onSuccess();
      } else {
        const redirectTo = searchParams.get('redirect');
        navigate(redirectTo || '/user/overview');
      }
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || err.response?.status === 500) {
        navigate('/error/500');
        return;
      }
      setServerError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    clearError();
    resetOtp();

    const normalizedEmail = getNormalizedEmail();

    if (!normalizedEmail) {
      setServerError('Email is required before requesting a new OTP');
      setStep('email');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setServerError('Please enter a valid email address');
      setStep('email');
      return;
    }

    setIsLoading(true);
    try {
      await resendOtp({ email: normalizedEmail });
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || err.response?.status === 500) {
        navigate('/error/500');
        return;
      }
      setServerError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── OTP input handlers ── */
  const handleOtpChange = (el: HTMLInputElement, i: number) => {
    if (!/^\d?$/.test(el.value)) return;
    clearError();
    const next = [...otp];
    next[i] = el.value;
    setOtp(next);
    if (el.value && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0)
      inputRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasted)) return;
    setOtp(pasted.split(''));
    clearError();
    inputRefs.current[5]?.focus();
  };

  const LandPanel = (
    <div className="relative min-h-125 lg:min-h-full overflow-hidden bg-linear-to-br from-[#fff9ef] via-[#fff4fb] to-[#eef8ff]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,209,102,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(147,197,253,0.28),transparent_40%),radial-gradient(circle_at_55%_75%,rgba(251,182,206,0.26),transparent_42%)]" />

      <div className="absolute top-12 right-12 text-yellow-500 animate-pulse">
        <Blocks className="w-14 h-14" />
      </div>
      <div className="absolute bottom-16 left-12 text-pink-500">
        <ShieldCheck className="w-12 h-12" />
      </div>
      <div className="absolute top-1/4 left-16 text-cyan-500/80">
        <Database className="w-11 h-11" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-5 h-24 w-24 rounded-full bg-linear-to-br from-blue-400 via-pink-400 to-yellow-400 p-1">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center shadow-inner shadow-[#ffd7a6]">
              <Landmark className="w-10 h-10 text-[#ff9a2e]" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-[#2f2619] tracking-tight">
            Land Ownership Registry
          </h2>
          <p className="text-[#6f6354] mt-3">
            Verify your identity to access blockchain-backed land records,
            ownership history, and transfer status.
          </p>

          <div className="flex items-center justify-center -space-x-3 mt-6">
            <span className="w-11 h-11 rounded-full border-2 border-white bg-yellow-100 text-[#111] text-xs font-bold flex items-center justify-center shadow-sm">
              KYC
            </span>
            <span className="w-11 h-11 rounded-full border-2 border-white bg-pink-100 text-[#111] text-xs font-bold flex items-center justify-center shadow-sm">
              OTP
            </span>
            <span className="w-11 h-11 rounded-full border-2 border-white bg-blue-100 text-[#111] text-xs font-bold flex items-center justify-center shadow-sm">
              TX
            </span>
            <span className="w-11 h-11 rounded-full border-2 border-white bg-[#ffaf52] text-black text-xs font-bold flex items-center justify-center shadow-sm">
              +12k
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-white/80 to-transparent" />
    </div>
  );

  /* ── shared inner content ── */
  const AuthContent = (
    <div className="w-full max-w-6xl rounded-[2.25rem] border-[#eadcc8] bg-white shadow-[0_25px_50px_-12px_rgba(164,135,94,0.28)] overflow-hidden border">
      <div className="flex flex-col lg:flex-row min-h-160">
        <div className="w-full lg:w-1/2 px-7 py-9 sm:px-10 sm:py-12 md:px-14 md:py-14 bg-[#fffdf8] text-[#2b241a] flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-[#2b241a] mb-3">
              Access LandChain
            </h1>
            <p className="text-[#746757] mb-10 text-lg">
              Enter your email to receive a one-time code and view your land
              parcels, titles, and on-chain verification status.
            </p>

            <ErrorBox msg={serverError} />

            <form onSubmit={handleOtpSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    disabled={step === 'otp'}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    onBlur={() => setEmail((prev) => prev.trim())}
                    placeholder="owner@domain.com"
                    className="flex-1 bg-white border border-[#e8dccb] text-[#2b241a] px-5 py-4 rounded-xl placeholder:text-[#9d927f] text-sm transition-all disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#ffd9a7] focus:border-[#ffaf52]"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || step === 'otp'}
                    className="bg-[#ffe9ca] hover:bg-[#ffdcae] text-[#7a4a00] px-4 py-4 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading && step === 'email' ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Enter 6-digit OTP</Label>
                <div className="grid grid-cols-6 gap-2 md:gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      disabled={step !== 'otp'}
                      onChange={(e) => handleOtpChange(e.target, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      onPaste={handleOtpPaste}
                      onFocus={(e) => e.target.select()}
                      className={`w-full h-14 bg-white border text-[#2b241a] text-center text-xl font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#ffd9a7]
                      ${step !== 'otp' ? 'opacity-60 cursor-not-allowed border-[#e7ddcf]' : 'border-[#e1d3bf] focus:border-[#ffaf52]'}`}
                    />
                  ))}
                </div>
                {step === 'otp' && (
                  <p className="text-sm text-[#7f7567]">
                    Didn&apos;t receive it?{' '}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleResend}
                      className="font-semibold text-[#ffaf52] hover:text-[#ffbf72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Resend code
                    </button>
                    <span className="ml-2 text-[#9c8f7b]">·</span>
                    <span className="ml-2 inline-flex items-center gap-1 text-[#9c8f7b]">
                      <MapPinned className="w-4 h-4" />
                      Secure verification
                    </span>
                  </p>
                )}
              </div>

              <SubmitBtn
                loading={isLoading && step === 'otp'}
                label="Verify & Continue"
                loadingLabel="Verifying..."
              />
            </form>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2">{LandPanel}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fff7ec] to-[#fffdf8] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-4 h-4 rounded-full bg-orange-300 opacity-50" />
      <div className="absolute bottom-20 right-40 w-6 h-6 rounded-full bg-pink-200 opacity-40" />
      <div className="absolute top-1/2 left-10 w-32 h-32 border border-[#f0e4d2] rounded-full opacity-70" />
      <div className="relative z-10 w-full flex justify-center">
        {AuthContent}
      </div>
    </div>
  );
}
