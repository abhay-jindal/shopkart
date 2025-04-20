import React, { createContext, useContext } from 'react';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showSuccess = (msg) =>
    toast.success(msg, { icon: '✅' });

  const showError = (msg) =>
    toast.error(msg, { icon: '❌' });

  const showInfo = (msg) =>
    toast.info(msg, { icon: 'ℹ️' });

  const showWarning = (msg) =>
    toast.warning(msg, { icon: '⚠️' });

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        draggable
        transition={Slide}
        toastClassName={({ type }) => {
          const base =
            'backdrop-blur-sm bg-opacity-10 text-sm rounded-md px-4 py-2 flex items-center border shadow-sm';
          const colorMap = {
            success: 'border-green-500 text-green-600 bg-green-100',
            error: 'border-red-500 text-red-600 bg-red-100',
            info: 'border-blue-400 text-blue-600 bg-blue-100',
            warning: 'border-yellow-400 text-yellow-600 bg-yellow-100',
          };
          return `${base} ${colorMap[type] || 'border-gray-300 text-gray-800 bg-white/60'}`;
        }}
        bodyClassName="m-0 p-0 leading-tight"
        closeButton={false}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
