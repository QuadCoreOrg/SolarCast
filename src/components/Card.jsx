const variants = {
  dashboard: 'bg-background',
  accent: 'bg-breeze',
};

const baseClasses =
  'border-4 border-shade rounded-3xl p-6 shadow-[6px_6px_0px_0px_var(--shade)]';

function Card({ children, variant = 'dashboard', className = '', ...props }) {
  const variantClasses = variants[variant] || variants.dashboard;

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
