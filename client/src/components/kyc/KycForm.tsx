import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';



import { userApi } from '@/services/user/user.api';
import { useUserKycStore } from '@/store/user/user.kyc.store';
import type { UserSubmitKycPayload } from '@/types/user/user.kyc.types';

import axios from 'axios';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  FileText,
  MapPin,
  Phone,
  RefreshCcw,
  Upload,
  User,
} from 'lucide-react';

const EMPTY_FORM: Omit<UserSubmitKycPayload, 'pan_document'> & {
  pan_document: File | null;
} = {
  pan_name: '',
  phone: '',
  address: '',
  pincode: '',
  district: '',
  state: 'chhattisgarh',
  pan_number: '',
  pan_document: null,
};

export default function KycForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileName = useMemo(
    () => formData.pan_document?.name ?? null,
    [formData.pan_document]
  );

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const nextValue = name === 'pan_name' ? value.toUpperCase() : value;
    setError(null);
    setSuccess(null);
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, pan_document: file }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.pan_document) {
      setError('PAN document is required.');
      return;
    }

    setIsLoading(true);
    try {
      await userApi.submitKyc(formData as UserSubmitKycPayload);
      setSuccess('KYC details submitted for review.');
      await useUserKycStore.getState().fetchStatus({ force: true });
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || err.response?.status === 500) {
        navigate('/error/500');
        return;
      }
      setError(err.response?.data?.message ?? 'Unable to submit KYC.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" mx-auto space-y-8 py-4">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-r from-emerald-50 via-white to-violet-50 p-5 md:p-6 shadow-sm">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/60 blur-2xl" />
        <div className="relative space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Identity Verification
          </span>

          <p className="max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm">
            Please provide your official details as per your PAN card to unlock
            full registry features.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 md:text-xs">
              Accurate details only
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 md:text-xs">
              Secure document upload
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 md:text-xs">
              Quick review process
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Personal & Identity Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-violet-50 rounded-lg">
              <User className="w-4 h-4 text-violet-600" />
            </div>
            <h2 className="font-semibold text-slate-800">Personal Details</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[0.78rem] font-bold text-slate-700 uppercase tracking-wider">
                Full Name (As per PAN)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="pan_name"
                  type="text"
                  value={formData.pan_name}
                  onChange={onChange}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.78rem] font-bold text-slate-700 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={onChange}
                  required
                  pattern="^[6-9]\d{9}$"
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.78rem] font-bold text-slate-700 uppercase tracking-wider">
                PAN Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="pan_number"
                  type="text"
                  value={formData.pan_number}
                  onChange={onChange}
                  required
                  pattern="^[A-Za-z]{5}[0-9]{4}[A-Za-z]$"
                  placeholder="ABCDE1234F"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm uppercase"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Address Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="font-semibold text-slate-800">
              Residential Address
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[0.78rem] font-bold text-slate-700 uppercase tracking-wider">
                Address Line
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={onChange}
                required
                rows={2}
                placeholder="House No., Street, Locality"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.78rem] font-bold text-slate-700 uppercase tracking-wider">
                State
              </label>
              <input
                type="text"
                value="Chhattisgarh"
                readOnly 
                aria-readonly="true"
                placeholder='Select State'
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.78rem] font-bold text-slate-700 uppercase tracking-wider">
                District
              </label>
              <input
                name="district"
                type="text"
                value={formData.district}
                onChange={onChange}
                required
                placeholder="District Name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.78rem] font-bold text-slate-700 uppercase tracking-wider">
                Pincode
              </label>
              <input
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={onChange}
                required
                pattern="^[0-9]{6}$"
                placeholder="6 digits"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
              />
            </div>
          </div>
        </section>

        {/* Document Upload Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Upload className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-semibold text-slate-800">Document Upload</h2>
          </div>

          <div className="space-y-3">
            <label className="text-[0.78rem] font-bold text-slate-700 uppercase tracking-wider">
              PAN Card Copy
            </label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 ${fileName ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-violet-400 bg-slate-50/50'}`}
            >
              <input
                id="pan_document"
                type="file"
                onChange={onFileChange}
                placeholder='Add Pancard Image'
                required
                accept="application/pdf,image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {fileName ? (
                <>
                  <FileText className="w-10 h-10 text-emerald-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-emerald-800">
                      {fileName}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Click or drag to replace
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-300" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      High-quality image (Max 5MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Action Buttons & Feedback */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  Processing KYC...
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData(EMPTY_FORM);
                setError(null);
                setSuccess(null);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Reset Form
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
