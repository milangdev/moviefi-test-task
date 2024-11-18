// Button.tsx
import React, { ReactNode } from "react";

interface ButtonProps {
  type: "submit" | "button" | "reset";
  onClick?: () => void;
  width: string;
  height: string;
  children: ReactNode;
  bgColor?: string; // New prop for background color
  borderColor?: string; // New prop for border color
  hoverColor?: string; // New prop for hover color
  className?: string;
  disabled?: boolean;
}

/**
 * A customizable button component that supports various styles and states.
 *
 * @param {Object} props - The properties for the button component.
 * @param {"submit" | "button" | "reset"} props.type - The type of the button.
 * @param {() => void} [props.onClick] - Optional click handler function.
 * @param {string} props.width - The width of the button.
 * @param {string} props.height - The height of the button.
 * @param {ReactNode} props.children - The content to be displayed within the button.
 * @param {string} [props.bgColor] - Optional background color for the button.
 * @param {string} [props.borderColor] - Optional border color for the button.
 * @param {string} [props.hoverColor] - Optional hover color for the button.
 * @param {string} [props.className] - Optional additional class names for styling.
 * @param {boolean} [props.disabled] - Optional flag to disable the button.
 * @returns {JSX.Element} The rendered button component.
 */
const Button: React.FC<ButtonProps> = ({
  type,
  onClick,
  width,
  height,
  children,
  bgColor,
  borderColor,
  hoverColor,
  className,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={` ${width} ${height}  text-white ${bgColor} ${borderColor} rounded-md ${hoverColor}  ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
