import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children, className = '' }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-shade/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_#2A2A33] max-w-md w-full max-h-[80vh] overflow-y-auto ${className}`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-breeze border-4 border-slate-900 rounded-full p-2 shadow-[3px_3px_0px_0px_#2A2A33] active:translate-y-1 active:shadow-none transition-all hover:bg-blossom"
            >
              <X className="w-5 h-5 text-shade" />
            </button>
            {title && <h2 className="font-black text-2xl mb-4 pr-8 text-shade">{title}</h2>}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
