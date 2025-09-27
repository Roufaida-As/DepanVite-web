import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colors: [textColor: string, borderColor: string, insideColor: string];
  buttonName: string;
}

const Button: React.FC<ButtonProps> = ({ buttonName, colors, ...props }) => {
  const [textColor, borderColor, insideColor] = colors;

  return (
    <button
      {...props} // 🔹 ensures onClick, disabled, type, etc. work
      className={`
        px-4 py-2 rounded-lg font-semibold 
        border ${borderColor} 
        ${insideColor} 
        ${textColor} 
        hover:opacity-80 transition
      `}
    >
      {buttonName}
    </button>
  );
};

export default Button;
