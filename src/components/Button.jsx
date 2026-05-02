import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-sunlit-deep',
  secondary: 'bg-sprout-deep',
  accent: 'bg-breeze-deep',
  peach: 'bg-blossom-deep',
};

const baseClasses =
  'border-4 border-slate-900 rounded-full font-bold text-shade shadow-[4px_4px_0px_0px_#2A2A33]';

function Button({
  children,
  variant = 'primary',
  icon: Icon,
  onClick,
  className = '',
  disabled = false,
  ...props
}) {
  const variantClasses = variants[variant] || variants.primary;
  const isIconOnly = Icon && !children;

  const buttonClasses = isIconOnly
    ? `${variantClasses} ${baseClasses} p-3`
    : `${variantClasses} ${baseClasses} px-6 py-3`;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ y: 4, boxShadow: 'none' }}
      className={`${buttonClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={children ? 'mr-2 w-5 h-5' : 'w-5 h-5'} />}
      {children}
    </motion.button>
  );
}

export default Button;
