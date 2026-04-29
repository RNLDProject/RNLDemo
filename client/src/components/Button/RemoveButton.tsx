import { type FC } from "react";

interface RemoveButtonProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

const RemoveButton: FC<RemoveButtonProps> = ({ label, onRemove, className }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault(); 
        onRemove();
      }}
      className={`mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium ${className}`}
    >
      {label}
    </button>
  );
};

export default RemoveButton;