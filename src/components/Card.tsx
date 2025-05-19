import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, title, className = '', onClick }) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`} onClick={onClick}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;