import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
}

const Card = ({ title, subtitle, children, footer, actions }: CardProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      {(title || actions) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
      {footer && <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">{footer}</div>}
    </div>
  );
};

export default Card;