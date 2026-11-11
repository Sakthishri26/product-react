function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
        <p className="mb-5 text-lg">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="rounded bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;