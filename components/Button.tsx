import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  // Added rounded-theme and border-theme (if variant supports it)
  // Note: We use border-theme for borderWidth dynamic adjustments
  const baseStyle = "uppercase tracking-[0.2em] text-xs font-sans font-medium py-3 px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-theme";
  
  const variants = {
    primary: "bg-charcoal text-white hover:bg-black border-theme border-transparent",
    secondary: "bg-stone text-charcoal hover:bg-gray-300 border-theme border-transparent",
    outline: "bg-transparent text-charcoal border-theme border-charcoal hover:bg-charcoal hover:text-white"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          CURATING...
        </span>
      ) : children}
    </button>
  );
};