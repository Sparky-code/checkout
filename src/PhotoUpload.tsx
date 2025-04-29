import React, { useRef, useState, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Slider } from '@mui/material';
import Cropper from 'react-easy-crop';

interface PhotoUploadProps {
  onImage: (image: File | string) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', error => reject(error));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
};

async function getCroppedImg(imageSrc: string, crop: any, zoom: number): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const scale = image.naturalWidth / image.width;
  const cropX = crop.x * scale;
  const cropY = crop.y * scale;
  const cropWidth = crop.width * scale;
  const cropHeight = crop.height * scale;
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No canvas context');
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );
  // Compress to JPEG at 0.7 quality
  return canvas.toDataURL('image/jpeg', 0.7);
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setCropDialogOpen(true);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropDone = async () => {
    if (imageUrl && croppedAreaPixels) {
      const cropped = await getCroppedImg(imageUrl, croppedAreaPixels, zoom);
      setCropDialogOpen(false);
      setImageUrl(null);
      onImage(cropped);
    }
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setImageUrl(null);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button variant="contained" onClick={handleCameraClick} sx={{ mr: 2 }}>
        Upload Photo / Use Camera
      </Button>
      <Dialog open={cropDialogOpen} onClose={handleCropCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Crop Receipt</DialogTitle>
        <DialogContent>
          <Box position="relative" width="100%" height={300} bgcolor="#222">
            {imageUrl && (
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={3/4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </Box>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, v) => setZoom(Number(v))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCropCancel}>Cancel</Button>
          <Button onClick={handleCropDone} variant="contained">Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PhotoUpload; 