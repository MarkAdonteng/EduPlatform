import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadFieldProps {
  id: string;
  accept?: string;
  label: string;
  onChange: (file: File) => void;
  required?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  id,
  accept,
  label,
  onChange,
  required = false
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          required={required}
          className="hidden"
        />
        <label
          htmlFor={id}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          <Upload className="h-5 w-5 mr-2" />
          Choose File
        </label>
      </div>
    </div>
  );
};

export default FileUploadField;