import React, { useState } from 'react';
import { Typography, Box, Alert, LinearProgress } from '@mui/material';
import Tesseract from 'tesseract.js';

interface ReceiptScraperProps {
  image: File | string;
  onExtracted?: (text: string) => void;
}

const ReceiptScraper: React.FC<ReceiptScraperProps> = ({ image, onExtracted }) => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (!image) {
      setObjectUrl(null);
      console.log('[ReceiptScraper] No image provided, objectUrl cleared.');
      return;
    }
    if (typeof image === 'string') {
      setObjectUrl(image);
      console.log('[ReceiptScraper] Received image as string:', image);
      return;
    }
    const url = URL.createObjectURL(image);
    setObjectUrl(url);
    console.log('[ReceiptScraper] Created object URL:', url);
    return () => {
      URL.revokeObjectURL(url);
      console.log('[ReceiptScraper] Revoked object URL:', url);
    };
  }, [image]);

  React.useEffect(() => {
    if (!objectUrl) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    setStartTime(Date.now());
    setEndTime(null);
    console.log('[ReceiptScraper] Starting OCR for:', objectUrl);
    const processImage = async () => {
      try {
        const result = await Tesseract.recognize(objectUrl, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text' && m.progress) {
              setProgress(Math.round(m.progress * 100));
              console.log(`[ReceiptScraper] OCR progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        });
        setText(result.data.text);
        console.log('[ReceiptScraper] OCR complete. Text:', result.data.text);
        if (onExtracted) {
          console.log('[ReceiptScraper] Calling onExtracted callback.');
          onExtracted(result.data.text);
        }
        setEndTime(Date.now());
      } catch (err) {
        setError((err as Error).message || 'Unknown error');
        console.error('[ReceiptScraper] OCR error:', err);
      } finally {
        setLoading(false);
        console.log('[ReceiptScraper] OCR process finished.');
      }
    };
    processImage();
  }, [objectUrl, onExtracted]);

  return (
    <Box mt={2}>
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