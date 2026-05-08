import Spinner from './Spinner';

const variants = {
  primary: 'bg-[var(--navy-700)] hover:bg-[var(--navy-600)] text-white',
  danger:  'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  ghost:   'bg-[var(--navy-50)] hover:bg-[var(--navy-100)] text-[var(--navy-700)]',
  outline: 'border border-[var(--color-border)] hover:bg-[var(--navy-50)] text-[var(--navy-700)] bg-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  size = 'md',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--navy-400)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
