import React, { useRef } from 'react';
import { Image, X } from 'lucide-react';

interface ImageUploadProps {
  image: string | null;
  onImageSelect: (image: string) => void;
  onImageRemove: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  image, 
  onImageSelect, 
  onImageRemove 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      
      {image ? (
        <div className="relative inline-block">
          <img 
            src={image} 
            alt="Selected" 
            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
          />
          <button
            onClick={onImageRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Upload image"
        >
          <Image className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};