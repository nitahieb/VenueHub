import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { validateImageFile, resizeImage } from '../utils/imageUtils';

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
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError(null);

    try {
      const newImages: string[] = [];

      for (const file of acceptedFiles) {
        if (images.length + newImages.length >= maxImages) {
          setError(`Maximum ${maxImages} images allowed`);
          break;
        }

        const validation = validateImageFile(file);
        if (!validation.isValid) {
          setError(validation.error || 'Invalid file');
          continue;
        }

        // Resize and compress image
        const resizedImage = await resizeImage(file);
        newImages.push(resizedImage);
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    } catch (err) {
      setError('Failed to process images. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: uploading || images.length >= maxImages
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : images.length >= maxImages
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Processing images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {images.length >= maxImages ? 'Maximum images reached' : 'Upload Venue Photos'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isDragActive
                ? 'Drop the images here...'
                : `Drag & drop images here, or click to select (${images.length}/${maxImages})`}
            </p>
            {images.length < maxImages && (
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Choose Photos
              </button>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Supported: JPG, PNG, WebP. Max 10MB per image.
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

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
                
                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index + 1)}
                        className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Main Image Indicator */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Main Photo
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            The first image will be used as the main photo. Drag images to reorder.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;