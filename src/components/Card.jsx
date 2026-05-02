const variants = {
  dashboard: 'bg-white',
  accent: 'bg-soft-peach',
};

const baseClasses = 'border-4 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#0f172a]';

function Card({ children, variant = 'dashboard', className = '', ...props }) {
  const variantClasses = variants[variant] || variants.dashboard;

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;