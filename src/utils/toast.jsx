// utils/toast.js
import toast from 'react-hot-toast';

// Success toast
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 1500,
    icon: '✅',
    style: {
      background: '#10b981',
      color: 'white',
      fontWeight: '500',
    },
    ...options
  });
};

// Error toast
export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 3000,
    icon: '❌',
    style: {
      background: '#ef4444',
      color: 'white',
      fontWeight: '500',
    },
    ...options
  });
};

// Warning toast
export const showWarning = (message, options = {}) => {
  return toast(message, {
    duration: 2000,
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: 'white',
      fontWeight: '500',
    },
    ...options
  });
};

// Info toast
export const showInfo = (message, options = {}) => {
  return toast(message, {
    duration: 1500,
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: 'white',
      fontWeight: '500',
    },
    ...options
  });
};

// Loading toast
export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    style: {
      background: '#6b7280',
      color: 'white',
      fontWeight: '500',
    },
    ...options
  });
};

// Promise toast - useful for async operations
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred!',
    },
    {
      style: {
        fontWeight: '500',
      },
      success: {
        duration: 3000,
        style: {
          background: '#10b981',
          color: 'white',
        },
      },
      error: {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
        },
      },
      ...options
    }
  );
};

// Custom toast with custom styling
export const showCustom = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    ...options
  });
};

// Dismiss all toasts
export const dismissAll = () => {
  toast.dismiss();
};

// Dismiss specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Default export for basic usage
export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  promise: showPromise,
  custom: showCustom,
  dismiss: dismissToast,
  dismissAll: dismissAll
};