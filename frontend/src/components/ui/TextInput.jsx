import React from "react";

const TextInput = ({
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    onChange,
    onBlur,
    error = null,
    required = false,
    className = "",
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                className={`w-full px-3 py-2 border ${
                    error
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default TextInput;
