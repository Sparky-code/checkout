import React, { useRef, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, InputAdornment, LinearProgress, CircularProgress, Alert } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, UploadFile as UploadFileIcon, Edit as EditIcon, Article as ArticleIcon } from '@mui/icons-material';

interface PhotoUploadProps {
  onPhotoUpload: (file: File) => void;
  onManualEntry: () => void;
  uploadStatus: 'idle' | 'uploading' | 'processing' | 'done' | 'error';
  setUploadStatus: (status: 'idle' | 'uploading' | 'processing' | 'done' | 'error') => void;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoUpload,
  onManualEntry,
  uploadStatus,
  setUploadStatus,
  dragActive,
  setDragActive,
}) => {
  const [title, setTitle] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleTitleEdit = () => {
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 100);
  };

  const handleTitleBlur = () => setEditingTitle(false);

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setEditingTitle(false);
  };

  const validateAndProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file (jpg, png, etc).');
      setUploadStatus('error');
      return;
    }

    try {
      const reader = new FileReader();
      
      reader.onerror = () => {
        setErrorMessage('Error reading file');
        setUploadStatus('error');
      };

      reader.onload = async () => {
        try {
          setUploadStatus('uploading');
          // Simulate upload delay
          await new Promise(res => setTimeout(res, 500));
          setUploadStatus('processing');
          // Simulate OCR processing
          await new Promise(res => setTimeout(res, 1000));
          onPhotoUpload(file);
          setUploadStatus('done');
        } catch (err) {
          setErrorMessage('Error processing file');
          setUploadStatus('error');
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMessage('Error reading file');
      setUploadStatus('error');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload an image file (jpg, png, etc).');
        setUploadStatus('error');
        return;
      }
      await validateAndProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload an image file (jpg, png, etc).');
        setUploadStatus('error');
        return;
      }
      validateAndProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <Box>
      {/* Status Indicator */}
      {uploadStatus === 'uploading' && <LinearProgress sx={{ mb: 2 }} />}
      {uploadStatus === 'processing' && (
        <Box display="flex" alignItems="center" mb={2}>
          <CircularProgress size={24} />
          <Typography sx={{ ml: 1 }}>Processing...</Typography>
        </Box>
      )}
      {uploadStatus === 'done' && <Alert severity="success" sx={{ mb: 2 }}>Processing complete!</Alert>}
      {uploadStatus === 'error' && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage || 'There was an error processing your bill.'}</Alert>}

      {/* Editable Title */}
      <Box display="flex" alignItems="center" mb={2}>
        {editingTitle ? (
          <TextField
            inputRef={titleInputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder={title ? title : 'Name of bill'}
            size="small"
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon color="action" sx={{ opacity: 0.2 }} />
                </InputAdornment>
              ),
              style: { fontWeight: 600, fontSize: 22, opacity: title ? 1 : 0.75 }
            }}
            sx={{ flex: 1, fontWeight: 600, fontSize: 22, opacity: title ? 1 : 0.75, borderBottom: '2px solid #bbb' }}
          />
        ) : (
          <Box
            onClick={handleTitleEdit}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 22,
              color: title ? 'text.primary' : 'text.secondary',
              opacity: title ? 1 : 0.75,
              borderBottom: '2px solid #bbb',
              minHeight: 36,
            }}
          >
            {title || 'Name of bill'}
            <EditIcon color="action" sx={{ ml: 1, opacity: 0.2 }} />
          </Box>
        )}
      </Box>

      {/* Drag-and-drop area */}
      <Box
        sx={{
          width: '100%',
          aspectRatio: '3/2',
          maxWidth: 400,
          mx: 'auto',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: dragActive ? '2px dashed #1976d2' : '2px dashed #bbb',
          borderRadius: { xs: 0, sm: 3 },
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          transition: 'border 0.2s, background 0.2s',
          position: 'relative',
          cursor: 'pointer',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-testid="upload-area"
      >
        <ArticleIcon sx={{ fontSize: 96, opacity: 0.2 }} />
      </Box>

      {/* Camera/Upload/Manual Entry Buttons */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Box>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            ref={cameraInputRef}
            data-testid="camera-input"
          />
          <IconButton
            color="primary"
            onClick={() => cameraInputRef.current?.click()}
            data-testid="camera-button"
          >
            <PhotoCameraIcon />
          </IconButton>
        </Box>
        <Box>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
            data-testid="file-input"
          />
          <IconButton
            color="primary"
            onClick={() => fileInputRef.current?.click()}
            data-testid="file-button"
          >
            <UploadFileIcon />
          </IconButton>
        </Box>
        <Button
          variant="outlined"
          onClick={onManualEntry}
        >
          Enter manually
        </Button>
      </Box>
    </Box>
  );
};

export default PhotoUpload; 