// InputField.tsx
import React from "react";

interface InputFieldProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width: string;
  height: string;
  bgColor?: string; // New prop for background color
  borderColor?: string; // New prop for border color
  hoverColor?: string; // New prop for hover color
  className?: string;
}

/**
 * A customizable input field component.
 *
 * @param {string} id - The id of the input field.
 * @param {string} type - The type of the input field (e.g. "text", "email", etc.).
 * @param {string} placeholder - The placeholder text of the input field.
 * @param {string} value - The value of the input field.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange - The callback function to be called when the input field value changes.
 * @param {string} width - The width of the input field.
 * @param {string} height - The height of the input field.
 * @param {string} [bgColor] - The background color of the input field.
 * @param {string} [borderColor] - The border color of the input field.
 * @param {string} [hoverColor] - The color of the input field when it is focused.
 * @param {string} [className] - Additional CSS classes to add to the input field.
 */
const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  width,
  height,
  bgColor, // Default background color
  borderColor, // Default border color
  hoverColor, // Default focus color
  className,
}) => {
  return (
    <div className="w-full sm:w-auto">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={` ${width} ${height} px-4 py-2 text-gray-100 ${bgColor} ${borderColor} rounded-md focus:outline-none focus:ring-2 ${hoverColor} ${className}`}
        required
      />
    </div>
  );
};

export default InputField;
