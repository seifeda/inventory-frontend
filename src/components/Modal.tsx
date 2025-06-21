import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) => {
  const [isShowing, setIsShowing] = useState(false);
  
  useEffect(() => {
    console.log('Modal useEffect - isOpen:', isOpen);
    let timeoutId: ReturnType<typeof setTimeout>;
    
    if (isOpen) {
      console.log('Setting modal to show');
      setIsShowing(true);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      console.log('Setting modal to hide');
      timeoutId = setTimeout(() => {
        setIsShowing(false);
        // Restore body scroll
        document.body.style.overflow = '';
      }, 200);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  console.log('Modal render - isShowing:', isShowing, 'isOpen:', isOpen);
  
  if (!isShowing) {
    console.log('Modal not showing, returning null');
    return null;
  }
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };
  
  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
      aria-labelledby={title}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
          onClick={onClose}
        ></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full ${
            isOpen ? 'sm:translate-y-0 opacity-100' : 'sm:translate-y-4 opacity-0'
          }`}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X size={20} />
              </button>
            </div>
            <div className="mt-4">
              {children}
            </div>
          </div>
          
          {footer && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;