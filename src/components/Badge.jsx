const baseClasses =
  'border-4 border-slate-900 rounded-full px-3 py-1 text-sm font-black text-shade';

function Badge({ children, color = 'bg-sunlit-deep', className = '', ...props }) {
  return (
    <span className={`${baseClasses} ${color} ${className}`} {...props}>
      {children}
    </span>
  );
}

export default Badge;
