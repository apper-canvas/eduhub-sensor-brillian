import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false,
  options = [],
  className = "",
  ...props 
}) => {
  const Component = type === "select" ? Select : Input;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "select" ? (
        <Select error={error} {...props}>
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Component type={type} error={error} {...props} />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;