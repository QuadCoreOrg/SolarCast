const baseClasses = 'border-4 border-slate-900 rounded-full px-3 py-1 text-sm font-black text-slate-900';

function Badge({ children, color = 'bg-sunny-yellow', className = '', ...props }) {
  return (
    <span className={`${baseClasses} ${color} ${className}`} {...props}>
      {children}
    </span>
  );
}

export default Badge;