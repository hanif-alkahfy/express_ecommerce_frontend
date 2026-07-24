import { Button as FlowbiteButton } from 'flowbite-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  color = 'blue',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const variantStyles = {
    primary: 'bg-blue-700 hover:bg-blue-800 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'border border-gray-300 hover:bg-gray-100 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-base',
  };

  const disabledStyle = 'opacity-50 cursor-not-allowed';
  const variantStyle = variantStyles[variant] || variantStyles.primary;
  const sizeStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <FlowbiteButton
      type={type}
      color={color}
      size={size}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${variantStyle} ${sizeStyle} ${disabled || isLoading ? disabledStyle : ''} ${className}`}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </FlowbiteButton>
  );
}
