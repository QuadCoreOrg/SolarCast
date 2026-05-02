import { motion, AnimatePresence } from 'framer-motion';

const colorClasses = {
  success: 'bg-mint-green',
  warning: 'bg-sunny-yellow',
  error: 'bg-orange-400',
  info: 'bg-blue-400',
};

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  const toastClasses = `border-4 border-slate-900 rounded-2xl px-6 py-4 shadow-[6px_6px_0px_0px_#0f172a] font-bold text-slate-900 ${colorClasses[type] || colorClasses.success}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${toastClasses}`}
          onClick={onClose}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;