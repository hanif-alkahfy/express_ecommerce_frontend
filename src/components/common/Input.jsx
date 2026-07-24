import { TextInput, Label } from 'flowbite-react';

export default function Input({
  label,
  error,
  id,
  type = 'text',
  name,
  value,
  placeholder,
  required = false,
  disabled = false,
  onChange,
  onBlur,
  className = '',
  ...props
}) {
  const inputColor = error ? 'failure' : 'gray';

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <Label
          htmlFor={id}
          value={label}
          className={`mb-2 block ${error ? 'text-red-600' : 'text-gray-900'}`}
        />
      )}
      <TextInput
        id={id}
        name={name || id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        color={inputColor}
        helperText={error && <span className="text-red-600 text-sm">{error}</span>}
        {...props}
      />
    </div>
  );
}
