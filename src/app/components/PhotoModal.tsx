export default function PhotoModal({ photos, isOpen, onClose, onPhotoSelect }: any) {
  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl z-10 w-11/12 max-w-lg">
          <div className="p-4">
            <h2 className="text-lg font-semibold" id="modal-title">Escolha uma foto</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {photos.map((photo: any, index: any) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="cursor-pointer hover:scale-105 transition-transform rounded-full"
                  onClick={() => {
                    onPhotoSelect(photo);
                    onClose();
                  }}
                />
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}