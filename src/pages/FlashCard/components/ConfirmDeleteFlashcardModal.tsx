interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteFlashcardModal: React.FC<Props> = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">Xác nhận xóa</h2>
        <p className="text-gray-600 mb-6">Bạn có chắc muốn xóa flashcard? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg">Xóa</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteFlashcardModal;