import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  /** Örn. API isteği sürerken kapatmayı kilitleyin */
  preventClose = false,
}) {
  const tryClose = () => {
    if (preventClose) return
    onClose?.()
  }
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`absolute inset-0 bg-shade/30 backdrop-blur-sm ${preventClose ? 'cursor-not-allowed' : ''}`}
            onClick={tryClose}
            aria-disabled={preventClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative bg-background border-4 border-shade rounded-3xl p-6 shadow-[8px_8px_0px_0px_var(--shade)] max-w-md w-full max-h-[80vh] overflow-y-auto ${className}`}
          >
            <button
              type="button"
              disabled={preventClose}
              onClick={tryClose}
              className={`absolute top-4 right-4 bg-breeze border-4 border-shade rounded-full p-2 shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none transition-all hover:bg-blossom disabled:opacity-40 disabled:pointer-events-none`}
              aria-disabled={preventClose}
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
