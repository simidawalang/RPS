import React, { ChangeEventHandler } from 'react';

interface IInput {
  name?: string;
  id?: string;
  className?: string;
  type?: string;
  label?: string;
  onChange?: ChangeEventHandler;
  value?: string;
  placeholder?: string;
}

const Input = ({
  id,
  name,
  className,
  type = 'text',
  onChange,
  value,
  label,
  placeholder,
}: IInput) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="text-gray-600 uppercase mb-1 text-xs block">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={`border border-gray-400 rounded px-2 py-1 w-full`}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
