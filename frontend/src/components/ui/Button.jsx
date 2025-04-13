import React from "react";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    className = "",
    isLoading = false,
    disabled = false,
    onClick,
    ...props
}) => {
    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        primary:
            "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
        secondary:
            "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
        outline:
            "bg-white text-purple-600 border border-purple-300 hover:bg-purple-50 focus:ring-purple-500",
        text: "bg-transparent text-purple-600 hover:bg-purple-50 focus:ring-purple-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizeClasses = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-6 py-3",
    };

    const disabledClasses =
        disabled || isLoading
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer";

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
