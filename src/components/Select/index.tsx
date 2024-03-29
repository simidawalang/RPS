import React, { ChangeEventHandler } from 'react';

interface ISelectProps {
  name?: string;
  id?: string;
  className?: string;
  label?: string;
  onChange?: ChangeEventHandler;
  value?: string;
  placeholder?: string;
  children?: any;
}

const Input = ({ id, name, className, onChange, value, label, children }: ISelectProps) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="text-gray-600 uppercase mb-1 text-xs block">
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        className={`border border-gray-400 rounded px-2 py-1 w-full`}
        onChange={onChange}
        value={value}
      >
        {children}
      </select>
    </div>
  );
};

export default Input;
