import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}) => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    
    try {
      // Convert files to base64 URLs for preview (in a real app, you'd upload to Supabase Storage)
      const newImageUrls = await Promise.all(
        acceptedFiles.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      onImagesChange([...images, ...newImageUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading || images.length >= maxImages
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : images.length >= maxImages
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="h-6 w-6 text-blue-600" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {uploading ? 'Uploading images...' : 'Upload venue photos'}
            </p>
            <p className="text-gray-600">
              {images.length >= maxImages
                ? `Maximum ${maxImages} images reached`
                : isDragActive
                ? 'Drop the images here...'
                : `Drag & drop images here, or click to select (${images.length}/${maxImages})`
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports JPG, PNG, WebP up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image}
                    alt={`Venue image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Main Photo Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Main Photo
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
                
                {/* Image Number */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            <ImageIcon className="h-4 w-4 inline mr-1" />
            The first image will be used as the main photo for your venue listing.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;