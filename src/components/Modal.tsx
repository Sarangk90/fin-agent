import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  darkMode: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div 
        className={`relative w-full max-w-lg rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out 
                    ${darkMode ? 'bg-gray-800' : 'bg-white'}
                    ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {title && <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>}
          <button
            onClick={onClose}
            type="button"
            className={`p-1.5 rounded-md transition-colors 
                        ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <X size={24} />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-4 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 