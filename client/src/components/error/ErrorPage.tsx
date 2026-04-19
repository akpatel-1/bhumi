import { useNavigate } from 'react-router-dom';

type ErrorConfig = {
  code: string;
  title: string;
  message: string;
};

type ErrorPageProps = {
  errorConfig: ErrorConfig;
};

export default function ErrorPage({ errorConfig }: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="text-center">
        <h1 className="mb-4 text-8xl font-bold text-zinc-700">
          {errorConfig.code}
        </h1>

        <h2 className="mb-2 text-2xl font-semibold text-slate-900">
          {errorConfig.title}
        </h2>

        <p className="mb-8 max-w-md text-gray-700">{errorConfig.message}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border px-5 py-2.5 transition-colors border-zinc-300 text-zinc-700 hover:bg-zinc-100"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
