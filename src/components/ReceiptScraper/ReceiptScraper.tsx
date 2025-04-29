import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, LinearProgress } from '@mui/material';
import { useReceiptProcessing } from './hooks/useReceiptProcessing';
import { ProcessingStatus } from './types';

interface ReceiptScraperProps {
  image: File | string;
  onExtracted?: (text: string) => void;
}

const ReceiptScraper: React.FC<ReceiptScraperProps> = ({ image, onExtracted }) => {
  const {
    text,
    loading,
    progress,
    error,
    startTime,
    endTime,
    processImage
  } = useReceiptProcessing();

  useEffect(() => {
    if (image) {
      processImage(image);
    }
  }, [image, processImage]);

  useEffect(() => {
    if (text && onExtracted) {
      onExtracted(text);
    }
  }, [text, onExtracted]);

  return (
    <Box data-testid="receipt-scraper">
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Analyzing receipt: {loading ? 'Processing...' : error ? 'Error' : 'Done'}
      </Typography>
      
      {loading && (
        <>
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
          <Typography variant="body2" mt={1}>Progress: {progress}%</Typography>
        </>
      )}
      
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {endTime && startTime && (
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          Time taken: {((endTime - startTime) / 1000).toFixed(2)}s
        </Typography>
      )}
    </Box>
  );
};

export default ReceiptScraper; 