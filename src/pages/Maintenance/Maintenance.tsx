import React from "react";
import { RefreshCw, ShieldAlert } from "lucide-react";

interface MaintenancePageProps {
  message?: string;
  startAt?: string | null;
  endAt?: string | null;
  onRetry?: () => void;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ message, startAt, endAt, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-4 py-10">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10 text-center">
        <div className="flex items-center justify-center mb-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10" />
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.35em] text-amber-600 font-semibold mb-3">
          Hệ thống đang bảo trì
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Trang web tạm dừng để nâng cấp
        </h1>
        <p className="text-slate-600 leading-7 max-w-xl mx-auto">
          {message || "Chúng tôi đang bảo trì hệ thống để nâng cấp trải nghiệm. Vui lòng quay lại sau khi quá trình hoàn tất."}
        </p>

        <div className="mt-6 grid gap-3 text-sm text-slate-600 max-w-xl mx-auto">
          {startAt && (
            <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
              Bắt đầu: <span className="font-semibold text-slate-900">{new Date(startAt).toLocaleString("vi-VN")}</span>
            </div>
          )}
          {endAt && (
            <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
              Dự kiến hoàn tất: <span className="font-semibold text-slate-900">{new Date(endAt).toLocaleString("vi-VN")}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
