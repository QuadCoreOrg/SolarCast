import { motion, AnimatePresence } from 'framer-motion';
import useToastStore from '../hooks/useToast';

const colorClasses = {
  success: 'bg-sprout',
  warning: 'bg-blossom',
  error: 'bg-sunlit',
  info: 'bg-breeze',
};

const positionClasses = {
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  'top-center': 'top-6 left-1/2 -translate-x-1/2',
  'top-right': 'top-6 right-6',
};

const getAnimation = (position) => {
  if (position === 'top-center' || position === 'top-right') {
    return {
      initial: { opacity: 0, y: -50, scale: 0.8 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -50, scale: 0.8 },
    };
  }
  return {
    initial: { opacity: 0, y: 50, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.8 },
  };
};

function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const groupedToasts = {
    'bottom-center': toasts.filter((t) => t.position === 'bottom-center' || !t.position),
    'top-center': toasts.filter((t) => t.position === 'top-center'),
    'top-right': toasts.filter((t) => t.position === 'top-right'),
  };

  return (
    <>
      {Object.entries(groupedToasts).map(
        ([position, positionToasts]) =>
          positionToasts.length > 0 && (
            <div
              key={position}
              className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 ${position === 'top-right' ? 'items-end' : 'items-center'}`}
            >
              <AnimatePresence>
                {positionToasts.map((toast) => {
                  const animation = getAnimation(toast.position || 'bottom-center');
                  return (
                    <motion.div
                      key={toast.id}
                      initial={animation.initial}
                      animate={animation.animate}
                      exit={animation.exit}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`border-4 border-shade rounded-2xl px-6 py-4 shadow-[6px_6px_0px_0px_var(--shade)] font-bold text-shade cursor-pointer ${colorClasses[toast.type] || colorClasses.success}`}
                      onClick={() => removeToast(toast.id)}
                    >
                      {toast.message}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )
      )}
    </>
  );
}

export default ToastContainer;
