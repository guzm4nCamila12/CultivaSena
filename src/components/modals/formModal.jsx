const FormModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8">
        {children}
      </div>
    </div>
  );
};

export default FormModal;
