import { Alert as FlowbiteAlert } from 'flowbite-react';

export default function Alert({
  children,
  color = 'blue',
  icon,
  onDismiss,
  className = '',
  ...props
}) {
  const colorMap = {
    info: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    blue: 'blue',
    green: 'green',
    yellow: 'yellow',
    red: 'red',
  };

  const alertColor = colorMap[color] || 'blue';

  return (
    <FlowbiteAlert
      color={alertColor}
      onDismiss={onDismiss}
      className={`mb-4 ${className}`}
      icon={icon}
      {...props}
    >
      {children}
    </FlowbiteAlert>
  );
}
