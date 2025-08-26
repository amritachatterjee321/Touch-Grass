import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  currentImageUrl?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageChange,
  currentImageUrl,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFile(file);
      }
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
          dragActive 
            ? 'border-[#32cd32] bg-[#f0fff0]' 
            : 'border-[#87ceeb] bg-[#f0f8ff] hover:border-[#4682b4]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Event preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="retro-border bg-[#ffffff] p-3 rounded-lg">
                <ImageIcon className="h-8 w-8 text-[#87ceeb]" />
              </div>
              <div className="space-y-1">
                <p className="text-[#4682b4] text-sm font-semibold pixel-perfect">
                  Upload Event Image
                </p>
                <p className="text-[#666666] text-xs pixel-perfect">
                  Drag & drop or click to browse
                </p>
              </div>
              <Button
                type="button"
                onClick={openFileDialog}
                className="retro-button px-4 py-2 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90] transition-all duration-200 text-xs font-semibold"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {previewUrl && (
        <div className="text-center">
          <p className="text-[#32cd32] text-xs pixel-perfect">
            ✓ Image uploaded successfully
          </p>
        </div>
      )}
    </div>
  );
};
