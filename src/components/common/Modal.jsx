import { Modal as FlowbiteModal } from 'flowbite-react';

export default function Modal({
  show = false,
  onClose,
  title,
  children,
  size = 'md',
  popup = false,
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  return (
    <FlowbiteModal
      show={show}
      onClose={onClose}
      size={sizeClasses[size] || sizeClasses.md}
      popup={popup}
      className={className}
      {...props}
    >
      {title && (
        <FlowbiteModal.Header>
          {title}
        </FlowbiteModal.Header>
      )}
      <FlowbiteModal.Body>
        {children}
      </FlowbiteModal.Body>
    </FlowbiteModal>
  );
}
