import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'px-5 py-2.5 rounded-full font-bold text-sm transition shadow-sm inline-flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-[#b87c4c] hover:bg-[#9b643a] text-white',
    secondary: 'bg-[#ebd9d1] hover:bg-[#dfc3b7] text-slate-800',
    outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700',
    accent: 'bg-[#9d96cb] hover:bg-[#847cb5] text-slate-900',
  };

  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
    brand: 'bg-[#ebd9d1] text-[#7c4820]',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
