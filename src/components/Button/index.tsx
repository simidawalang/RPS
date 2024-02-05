import React, { MouseEventHandler, ReactNode } from 'react';

interface IButton {
  className?: string;
  onClick?: MouseEventHandler;
  children: ReactNode;
  disabled?: boolean;
}

const Button = ({ className, onClick, children, disabled }: IButton) => {
  return (
    <button
      className={`bg-lime-600 text-white rounded py-1.5 px-3 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
