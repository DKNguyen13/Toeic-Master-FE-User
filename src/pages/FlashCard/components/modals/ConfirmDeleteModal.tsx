interface Props {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<Props> = ({
  open,
  title = "Xác nhận xóa",
  message = "Bạn có chắc muốn xóa?",
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg">Xóa</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;