import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { ProcessingState } from '../types';

export const useReceiptProcessing = () => {
  const [state, setState] = useState<ProcessingState>({
    text: '',
    loading: false,
    progress: 0,
    error: null,
    startTime: null,
    endTime: null
  });

  const processImage = useCallback(async (image: File | string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      progress: 0,
      startTime: Date.now(),
      endTime: null
    }));

    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text' && m.progress) {
            setState(prev => ({
              ...prev,
              progress: Math.round(m.progress * 100)
            }));
          }
        }
      });

      setState(prev => ({
        ...prev,
        text: result.data.text,
        loading: false,
        endTime: Date.now()
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: (err as Error).message || 'Unknown error',
        loading: false,
        endTime: Date.now()
      }));
    }
  }, []);

  return {
    ...state,
    processImage
  };
}; 