'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, folder = 'portfolio', label = 'Resim Yükle' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const data = await res.json();
      onChange(data.url);
    } catch (error: any) {
      alert(error.message || 'Upload başarısız');
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      <div className="relative">
        {preview ? (
          <div className="relative group">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-64 object-cover rounded-lg border-2 border-cyan-500/20"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-64 border-2 border-dashed border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-colors flex flex-col items-center justify-center gap-3 bg-white/5"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                <p className="text-gray-400">Yükleniyor...</p>
              </>
            ) : (
              <>
                <Upload size={48} className="text-cyan-400" />
                <p className="text-gray-400">Resim yüklemek için tıklayın</p>
                <p className="text-sm text-gray-500">PNG, JPG, WEBP (max 5MB)</p>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}