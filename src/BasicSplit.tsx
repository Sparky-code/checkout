import React, { useState, useRef } from 'react';
import { TextField, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, IconButton, Tooltip, InputAdornment, Grid } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptScraper from './ReceiptScraper';

const BasicSplit: React.FC = () => {
  const [title, setTitle] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState('');
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false);
  const [ocrImage, setOcrImage] = useState<File | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showResult, setShowResult] = useState(false);

  const totalNum = parseFloat(total);
  const peopleNum = parseInt(people, 10);
  const perPerson = totalNum && peopleNum ? (totalNum / peopleNum).toFixed(2) : '';

  const handlePhotoUpload = (img: File | string) => {
    setOcrImage(img);
    setOcrDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleTitleEdit = () => {
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 100);
  };

  const handleTitleBlur = () => {
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditingTitle(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        {editingTitle ? (
          <TextField
            inputRef={titleInputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            placeholder={title ? title : ''}
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
      <TextField
        label="Total Bill ($)"
        value={total}
        onChange={e => setTotal(e.target.value)}
        type="text"
        margin="normal"
        fullWidth
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />
      <TextField
        label="Number of People"
        value={people}
        onChange={e => setPeople(e.target.value)}
        type="text"
        margin="normal"
        fullWidth
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />
      <Grid container spacing={2} mt={3} mb={2} alignItems="center">
        <Grid size={2}>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Tooltip title="Use Camera">
            <IconButton color="primary" onClick={() => cameraInputRef.current?.click()} sx={{ border: '1.5px solid', borderColor: 'primary.main', borderRadius: 1, width: '100%', height: 48 }}>
              <PhotoCameraIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid size={2}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Tooltip title="Upload Photo">
            <IconButton color="primary" onClick={() => fileInputRef.current?.click()} sx={{ border: '1.5px solid', borderColor: 'primary.main', borderRadius: 1, width: '100%', height: 48 }}>
              <UploadFileIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid size={8}>
          <Button variant="contained" color="primary" sx={{ width: '100%', height: 48 }} onClick={() => setShowResult(true)}>
            Checkout
          </Button>
        </Grid>
      </Grid>
      {showResult && perPerson && (
        <>
          <Box sx={{ my: 2 }}>
            <Box sx={{ borderTop: '1px solid #ccc', width: '100%', mb: 2 }} />
            <Typography variant="h6">
              Each person pays: ${perPerson}
            </Typography>
          </Box>
        </>
      )}
      <Dialog open={ocrDialogOpen} onClose={() => setOcrDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Extracted Text from Receipt</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOcrDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BasicSplit; 