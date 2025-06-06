const FormModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl shadow-lg w-full sm:w-3/4 md:w-3/4 lg:w-3/5 xl:w-2/4 2xl:w-2/5 p-6 mx-4 my-8">
        {children}
      </div>
    </div>
  );
};

export default FormModal;
