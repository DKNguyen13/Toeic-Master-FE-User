import React from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  title?: string;
  description?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  title = "Nâng cấp tài khoản",
  description = "Bạn cần nâng cấp lên gói Premium để sử dụng tính năng này.",
}) => {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      window.location.href = "/payment";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl text-center font-bold mb-4">{title}</h3>
        <p className="mb-6 text-gray-600">{description}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"> Hủy</button>
          <button onClick={handleUpgrade} className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600">Nâng cấp ngay</button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;