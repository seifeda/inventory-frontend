import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeTimeframe?: string;
  iconColor?: string;
};

const StatCard = ({ title, value, icon: Icon, change, changeTimeframe = 'since last month', iconColor = 'bg-blue-500' }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center">
        <div className={`${iconColor} p-3 rounded-md`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            {change !== undefined && (
              <div className={`ml-2 flex items-baseline text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? (
                  <span className="sr-only">Increased by</span>
                ) : (
                  <span className="sr-only">Decreased by</span>
                )}
                {change >= 0 ? '+' : ''}{change}%
              </div>
            )}
          </dd>
          {change !== undefined && (
            <p className="mt-1 text-sm text-gray-500">{changeTimeframe}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;