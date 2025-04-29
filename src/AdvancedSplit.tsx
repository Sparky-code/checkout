import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Typography, Box, TextField, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Grid, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, TextField as MuiTextField, Tooltip, Stack, LinearProgress, CircularProgress, Alert, Switch } from '@mui/material';
import { Delete, Close, Edit, ChevronLeft, ChevronRight } from '@mui/icons-material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptScraper from './ReceiptScraper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ArticleIcon from '@mui/icons-material/Article';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import UserAssignment from './UserAssignment';
import SummaryPage from './SummaryPage';
import ManualEntry from './components/ManualEntry/ManualEntry';

export interface Person {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface ItemAssignment {
  personId: string;
  weight: number;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  count?: number;
  assignments?: ItemAssignment[];
  assignedUsers?: string[];
  isSelected?: boolean;
}

const steps = [
  'Upload Bill',
  'Breakdown (OCR)',
  'Manual Entry',
  'People',
  'Items',
  'Summary',
];

const userColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96C93D', // Green
  '#A78BFA', // Purple
  '#FBBF24', // Yellow
  '#2DD4BF', // Cyan
  '#F472B6', // Pink
];

const generateInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    const word = words[0];
    return word.length > 1 
      ? `${word[0].toUpperCase()}${word[word.length - 1].toUpperCase()}` 
      : word[0].toUpperCase();
  }
  return words.map(word => word[0].toUpperCase()).join('').slice(0, 2);
};

const AdvancedSplit: React.FC = () => {
  const [title, setTitle] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [personName, setPersonName] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [assignItem, setAssignItem] = useState<Item | null>(null);
  const [assignments, setAssignments] = useState<ItemAssignment[]>([]);
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false);
  const [ocrImage, setOcrImage] = useState<File | string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrLines, setOcrLines] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [manualItems, setManualItems] = useState([{ name: '', price: '', count: 1 }]);
  const [manualSubtotal, setManualSubtotal] = useState('');
  const [manualTax, setManualTax] = useState('');
  const [manualTip, setManualTip] = useState('');
  const [isTipPercentage, setIsTipPercentage] = useState(true);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [ocrStartTime, setOcrStartTime] = useState<number | null>(null);
  const [ocrEndTime, setOcrEndTime] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [showSummary, setShowSummary] = useState(false);
  const [receiptSummary, setReceiptSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    tip: 0,
    date: '',
    merchant: '',
    originalImage: null as File | string | null
  });

  const sessionUrl = `${window.location.origin}/advanced?session=${sessionId}`;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    console.log('Items state changed:', items);
  }, [items]);

  // Add person
  const handleAddPerson = () => {
    if (personName.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: personName.trim(),
        initials: generateInitials(personName.trim()),
        color: userColors[people.length % userColors.length]
      };
      setPeople([...people, newPerson]);
      setPersonName('');
    }
  };
  // Remove person
  const handleRemovePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
  };

  const openAssignDialog = (item: Item) => {
    setAssignItem(item);
    // Default: split evenly among already assigned or all people
    const defaultAssignments = people.length > 0 ?
      (item.assignments && item.assignments.length > 0
        ? item.assignments
        : people.map(p => ({ personId: p.id, weight: 1 }))
      ) : [];
    setAssignments(defaultAssignments);
  };

  const handleTogglePerson = (personId: string) => {
    setAssignments(prev => {
      const exists = prev.find(a => a.personId === personId);
      if (exists) {
        return prev.filter(a => a.personId !== personId);
      } else {
        return [...prev, { personId, weight: 1 }];
      }
    });
  };

  const handleWeightChange = (personId: string, weight: number) => {
    setAssignments(prev => prev.map(a => a.personId === personId ? { ...a, weight } : a));
  };

  const handleSaveAssignments = () => {
    if (assignItem) {
      setItems(items.map(i => i.id === assignItem.id ? { ...i, assignments } : i));
      setAssignItem(null);
    }
  };

  const handleCloseAssign = () => {
    setAssignItem(null);
  };

  const handleTitleEdit = () => {
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 100);
  };
  const handleTitleBlur = () => setEditingTitle(false);
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setEditingTitle(false);
  };

  const handlePhotoUploadAndAdvance = (img: File | string) => {
    setOcrImage(img);
    setCurrentStep(1);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadStatus('error');
        alert('Please upload a valid image file (jpg, png, etc).');
        return;
      }
      setUploadStatus('uploading');
      setOcrStartTime(Date.now());
      setOcrEndTime(null);
      try {
        // Simulate upload delay
        await new Promise(res => setTimeout(res, 500));
        setUploadStatus('processing');
        // Simulate OCR processing (replace with your actual OCR logic)
        await new Promise(res => setTimeout(res, 1000));
        setOcrImage(file);
        setUploadStatus('done');
        setCurrentStep(1);
        setOcrEndTime(Date.now());
      } catch (err) {
        setUploadStatus('error');
        setOcrEndTime(Date.now());
      }
    }
  };

  const handleOcrExtracted = useCallback((text: string) => {
    console.log('OCR finished, current items:', items);
    setOcrText(text);
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    setOcrLines(lines);
    
    // Extract receipt summary information
    const summary = {
      subtotal: 0,
      tax: 0,
      total: 0,
      tip: 0,
      date: '',
      merchant: '',
      originalImage: ocrImage
    };

    // Try to extract merchant name (usually at the top)
    if (lines.length > 0) {
      summary.merchant = lines[0];
    }

    // Try to extract date (look for date patterns)
    const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)/;
    const dateLine = lines.find(line => datePattern.test(line));
    if (dateLine) {
      // Extract only numbers and punctuation
      const cleanDate = dateLine.replace(/[^\d\-\/:APM\s]/g, '').trim();
      summary.date = cleanDate;
    }

    // Try to extract amounts
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      const amountMatch = line.match(/([\$\d\.,]+)$/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(/[^\d.]/g, ''));
        
        if (lowerLine.includes('subtotal') || lowerLine.includes('sub-total')) {
          summary.subtotal = amount;
        } else if (lowerLine.includes('tax') || lowerLine.includes('gst') || lowerLine.includes('hst')) {
          summary.tax = amount;
        } else if (lowerLine.includes('tip') || lowerLine.includes('gratuity')) {
          summary.tip = amount;
        } else if (lowerLine.includes('total') && !lowerLine.includes('subtotal')) {
          summary.total = amount;
        }
      }
    });

    setReceiptSummary(summary);
    setTaxAmount(summary.tax);
    
    // Automatically add items from OCR text
    const newItems = lines
      .filter(line => line.includes('$'))
      .filter(line => {
        const lowerLine = line.toLowerCase();
        return !lowerLine.includes('subtotal') && 
               !lowerLine.includes('tax') && 
               !lowerLine.includes('total') && 
               !lowerLine.includes('round') && 
               !lowerLine.includes('rounding') &&
               !lowerLine.includes('tip') &&
               !lowerLine.includes('gratuity');
      })
      .map(line => {
        // Try to extract price (last $ or number in line)
        const priceMatch = line.match(/([\$\d\.,]+)$/);
        if (priceMatch) {
          const priceStr = priceMatch[1].replace(/[^\d.]/g, '');
          const price = parseFloat(priceStr);
          
          // Try to extract count (first number in line)
          const countMatch = line.match(/^(\d+)\s+/);
          const count = countMatch ? parseInt(countMatch[1]) : 1;
          
          // Extract name (everything between count and price)
          const nameStart = countMatch ? countMatch[0].length : 0;
          const nameEnd = priceMatch.index || line.length;
          const name = line.slice(nameStart, nameEnd).trim();
          
          if (name && !isNaN(price)) {
            return { id: Date.now().toString() + Math.random(), name, price, count, assignedUsers: [], isSelected: false };
          }
        }
        return null;
      })
      .filter(Boolean) as Item[];
    
    console.log('Adding items from OCR:', newItems);
    setItems(prevItems => {
      // Only add items if they don't already exist
      const existingNames = new Set(prevItems.map(item => item.name));
      const uniqueNewItems = newItems.filter(item => !existingNames.has(item.name));
      const updatedItems = [...prevItems, ...uniqueNewItems];
      console.log('Updated items array:', updatedItems);
      return updatedItems;
    });
    
    setSelectedLines(new Set());
    setOcrEndTime(Date.now());
  }, [ocrImage]);

  const handleToggleLine = (idx: number) => {
    setSelectedLines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) newSet.delete(idx);
      else newSet.add(idx);
      return newSet;
    });
  };

  const handleAddOcrItems = () => {
    // Try to extract name and price from each selected line
    const newItems = Array.from(selectedLines).map(idx => {
      const line = ocrLines[idx];
      // Try to extract price (last $ or number in line)
      const priceMatch = line.match(/([\$\d\.,]+)$/);
      if (priceMatch) {
        const priceStr = priceMatch[1].replace(/[^\d.]/g, '');
        const price = parseFloat(priceStr);
        
        // Try to extract count (first number in line)
        const countMatch = line.match(/^(\d+)\s+/);
        const count = countMatch ? parseInt(countMatch[1]) : 1;
        
        // Extract name (everything between count and price)
        const nameStart = countMatch ? countMatch[0].length : 0;
        const nameEnd = priceMatch.index || line.length;
        const name = line.slice(nameStart, nameEnd).trim();
        
        if (name && !isNaN(price)) {
          return { id: Date.now().toString() + Math.random(), name, price, count, assignedUsers: [], isSelected: false };
        }
      }
      return null;
    }).filter(Boolean) as Item[];
    
    console.log('Adding new items:', newItems);
    setItems(prevItems => {
      const updatedItems = [...prevItems, ...newItems];
      console.log('Updated items array:', updatedItems);
      return updatedItems;
    });
    setOcrDialogOpen(false);
    setOcrImage(null);
    setOcrText('');
    setOcrLines([]);
    setSelectedLines(new Set());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUploadAndAdvance(e.dataTransfer.files[0]);
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

  const handleManual = () => {
    setUploadStatus('idle');
    setCurrentStep(2);
  };

  return (
    <Box>
      {showSummary ? (
        <SummaryPage
          items={items}
          users={people}
          onBack={() => {
            setShowSummary(false);
            setCurrentStep(4);
          }}
          taxAmount={taxAmount}
          receiptSummary={receiptSummary}
        />
      ) : (
        <>
      {/* Page 1: Title, drag/upload/camera/manual */}
      {currentStep === 0 && (
        <>
          {/* Status Indicator */}
          {uploadStatus === 'uploading' && <LinearProgress sx={{ mb: 2 }} />}
          {uploadStatus === 'processing' && <Box display="flex" alignItems="center" mb={2}><CircularProgress size={24} /><span style={{marginLeft: 8}}>Processing...</span></Box>}
          {uploadStatus === 'done' && <Alert severity="success" sx={{ mb: 2 }}>Processing complete!</Alert>}
          {uploadStatus === 'error' && <Alert severity="error" sx={{ mb: 2 }}>There was an error processing your bill.</Alert>}
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
            onDrop={e => { handleDrop(e); setCurrentStep(1); }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ArticleIcon sx={{ fontSize: 96, opacity: 0.2 }} />
          </Box>
          {/* Camera/Upload/Manual Entry Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 1, mb: 2, alignItems: 'center' }}>
                <Box sx={{ width: '16.666%' }}>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={e => { handleFileChange(e); setCurrentStep(1); }}
              />
              <Tooltip title="Use Camera">
                <IconButton color="primary" onClick={() => cameraInputRef.current?.click()} sx={{ border: '1.5px solid', borderColor: 'primary.main', borderRadius: 1, width: '100%', height: 48 }}>
                  <PhotoCameraIcon />
                </IconButton>
              </Tooltip>
                </Box>
                <Box sx={{ width: '16.666%' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { handleFileChange(e); setCurrentStep(1); }}
              />
              <Tooltip title="Upload Photo">
                <IconButton color="primary" onClick={() => fileInputRef.current?.click()} sx={{ border: '1.5px solid', borderColor: 'primary.main', borderRadius: 1, width: '100%', height: 48 }}>
                  <UploadFileIcon />
                </IconButton>
              </Tooltip>
                </Box>
                <Box sx={{ width: '66.666%' }}>
              <Button variant="outlined" color="primary" sx={{ width: '100%', height: 48 }} onClick={handleManual}>
                Enter manually
              </Button>
                </Box>
              </Box>
        </>
      )}
      {/* Page 2: OCR breakdown or manual entry */}
      {currentStep === 1 && ocrImage && (
        <Box>
          <ReceiptScraper image={ocrImage} onExtracted={handleOcrExtracted} />
          {ocrText && (
            <>
                  {/* <Box mt={1}>
                <Typography variant="caption">Text Output:</Typography>
                <Box sx={{ whiteSpace: 'pre-wrap', background: theme.palette.background.paper, p: 1, borderRadius: 1, minHeight: 40, fontSize: 13 }}>
                  {ocrText}
                </Box>
                  </Box> */}
              {/* Render each line with a $ as a square button */}
                  <Box mt={2} display="flex" flexDirection="column" gap={0}>
                    {/* Items List */}
                    <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>ReceiptScraper</Typography>
                    {items.map((item, idx) => (
                      <Box
                        key={item.id}
                        sx={{
                          width: '100%',
                          minHeight: 48,
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          borderTop: idx === 0 ? '1px solid' : 'none',
                          borderBottom: '1px solid',
                          borderLeft: '1px solid',
                          borderRight: '1px solid',
                          backgroundColor: 'background.paper',
                          '&:hover': {
                            outline: '2px solid',
                            outlineColor: 'primary.main',
                            outlineOffset: '-2px'
                          }
                        }}
                      >
                        {editingItemId === item.id ? (
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2
                            }}
                            onBlur={(e) => {
                              // Only bake if the blur event is not from a child element
                              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                const newItems = items.map(i => {
                                  if (i.id === item.id) {
                                    const countInput = e.currentTarget.querySelector('input[placeholder="Count"]') as HTMLInputElement;
                                    const nameInput = e.currentTarget.querySelector('input[placeholder="Item name"]') as HTMLInputElement;
                                    const priceInput = e.currentTarget.querySelector('input[placeholder="Price"]') as HTMLInputElement;
                                    
                                    return {
                                      ...i,
                                      count: parseInt(countInput?.value || '1') || 1,
                                      name: nameInput?.value || '',
                                      price: parseFloat(priceInput?.value || '0') || 0
                                    };
                                  }
                                  return i;
                                });
                                setItems(newItems);
                                setEditingItemId(null);
                              }
                            }}
                          >
                            <TextField
                              size="small"
                              placeholder="Count"
                              defaultValue={item.count || 1}
                              error={false}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newItems = items.map(i => 
                                    i.id === item.id 
                                      ? { ...i, count: parseInt((e.target as HTMLInputElement).value) || 1 }
                                      : i
                                  );
                                  setItems(newItems);
                                }
                              }}
                              onChange={(e) => {
                                // Only allow numbers
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                if (value !== e.target.value) {
                                  e.target.closest('.MuiTextField-root')?.classList.add('error-outline');
                                  setTimeout(() => {
                                    e.target.closest('.MuiTextField-root')?.classList.remove('error-outline');
                                  }, 1000);
                                }
                                e.target.value = value;
                              }}
                              inputProps={{ 
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                style: { 
                                  MozAppearance: 'textfield',
                                  WebkitAppearance: 'none',
                                  margin: 0,
                                  padding: '8px 0',
                                  border: 'none',
                                  borderBottom: '0.5px solid rgba(0, 0, 0, 0.35)',
                                  borderRadius: 0
                                }
                              }}
                              sx={{ 
                                width: 40,
                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                  WebkitAppearance: 'none',
                                  margin: 0
                                },
                                '& input[type=number]': {
                                  MozAppearance: 'textfield'
                                },
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                    borderBottom: '0.5px solid rgba(0, 0, 0, 0.35)',
                                    borderRadius: 0
                                  },
                                  '&:hover fieldset': {
                                    border: 'none',
                                    borderBottom: '0.5px solid rgba(0, 0, 0, 0.87)'
                                  },
                                  '&.Mui-focused fieldset': {
                                    border: 'none',
                                    borderBottom: '0.5px solid #1976d2'
                                  }
                                },
                                '&.error-outline .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: '2px solid #f44336',
                                    borderBottom: '2px solid #f44336'
                                  }
                                }
                              }}
                              autoFocus
                            />
                            <TextField
                              size="small"
                              placeholder="Item name"
                              defaultValue={item.name}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newItems = items.map(i => 
                                    i.id === item.id 
                                      ? { ...i, name: (e.target as HTMLInputElement).value }
                                      : i
                                  );
                                  setItems(newItems);
                                }
                              }}
                              sx={{ 
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                    borderBottom: '0.5px solid rgba(0, 0, 0, 0.35)',
                                    borderRadius: 0
                                  },
                                  '&:hover fieldset': {
                                    border: 'none',
                                    borderBottom: '0.5px solid rgba(0, 0, 0, 0.87)'
                                  },
                                  '&.Mui-focused fieldset': {
                                    border: 'none',
                                    borderBottom: '0.5px solid #1976d2'
                                  }
                                }
                              }}
                            />
                            <TextField
                              size="small"
                              placeholder="Price"
                              defaultValue={item.price}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newItems = items.map(i => 
                                    i.id === item.id 
                                      ? { ...i, price: parseFloat((e.target as HTMLInputElement).value) || 0 }
                                      : i
                                  );
                                  setItems(newItems);
                                }
                              }}
                              onChange={(e) => {
                                // Only allow numbers and one decimal point
                                const value = e.target.value.replace(/[^0-9.]/g, '');
                                const decimalCount = (value.match(/\./g) || []).length;
                                if (decimalCount <= 1) {
                                  if (value !== e.target.value) {
                                    e.target.closest('.MuiTextField-root')?.classList.add('error-outline');
                                    setTimeout(() => {
                                      e.target.closest('.MuiTextField-root')?.classList.remove('error-outline');
                                    }, 1000);
                                  }
                                  e.target.value = value;
                                } else {
                                  e.target.closest('.MuiTextField-root')?.classList.add('error-outline');
                                  setTimeout(() => {
                                    e.target.closest('.MuiTextField-root')?.classList.remove('error-outline');
                                  }, 1000);
                                }
                              }}
                              inputProps={{ 
                                inputMode: 'decimal',
                                pattern: '[0-9.]*',
                                style: { 
                                  MozAppearance: 'textfield',
                                  WebkitAppearance: 'none',
                                  margin: 0,
                                  padding: '8px 0',
                                  border: 'none',
                                  borderBottom: '0.5px solid rgba(0, 0, 0, 0.35)',
                                  borderRadius: 0
                                }
                              }}
                              sx={{ 
                                width: 80,
                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                  WebkitAppearance: 'none',
                                  margin: 0
                                },
                                '& input[type=number]': {
                                  MozAppearance: 'textfield'
                                },
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: 'none',
                                    borderBottom: '0.5px solid rgba(0, 0, 0, 0.35)',
                                    borderRadius: 0
                                  },
                                  '&:hover fieldset': {
                                    border: 'none',
                                    borderBottom: '0.5px solid rgba(0, 0, 0, 0.87)'
                                  },
                                  '&.Mui-focused fieldset': {
                                    border: 'none',
                                    borderBottom: '0.5px solid #1976d2'
                                  }
                                },
                                '&.error-outline .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    border: '2px solid #f44336',
                                    borderBottom: '2px solid #f44336'
                                  }
                                }
                              }}
                              InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingItemId(null);
                                setItems(items.filter(i => i.id !== item.id));
                              }}
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                  color: 'error.main'
                                }
                              }}
                            >
                              <Close />
                            </IconButton>
                          </Box>
                        ) : (
                          <>
                            <Typography sx={{ width: 40, fontSize: 13 }}>{item.count || 1}</Typography>
                            <Typography sx={{ flex: 1, fontSize: 13 }}>{item.name}</Typography>
                            <Typography sx={{ width: 80, fontSize: 13 }}>${item.price.toFixed(2)}</Typography>
                            <IconButton
                              size="small"
                              onClick={() => setItems(items.filter((_, i) => i !== idx))}
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                  color: 'error.main'
                                }
                              }}
                            >
                              <Close />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    ))}
                    {/* Add Additional Items Button */}
                    <Box mt={2}>
                  <Button
                        variant="text" 
                        color="primary" 
                        onClick={() => {
                          const newItem = { 
                            id: Date.now().toString(), 
                            name: '', 
                            price: 0,
                            count: 1,
                            assignedUsers: [],
                            isSelected: false
                          };
                          setItems([...items, newItem]);
                          setEditingItemId(newItem.id);
                        }}
                        sx={{ 
                          textTransform: 'none',
                          fontSize: 14,
                          mb: 2
                        }}
                      >
                        Add additional items
                  </Button>
                    </Box>
              </Box>
            </>
          )}
        </Box>
      )}
          {/* Page 3: Manual Entry */}
      {currentStep === 2 && (
        <ManualEntry
          items={items}
          setItems={setItems}
          manualItems={manualItems}
          setManualItems={setManualItems}
          manualTax={manualTax}
          setManualTax={setManualTax}
          manualTip={manualTip}
          setManualTip={setManualTip}
          isTipPercentage={isTipPercentage}
          setIsTipPercentage={setIsTipPercentage}
          validationAttempted={validationAttempted}
          setValidationAttempted={setValidationAttempted}
        />
      )}
          {/* Page 4: User Assignment */}
          {currentStep === 3 && (
            <UserAssignment 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
              items={items}
              setItems={setItems}
              users={people}
              setUsers={setPeople}
            />
          )}
          {/* Page 5: Items Assignment */}
          {currentStep === 4 && (
            <UserAssignment 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
              items={items}
              setItems={setItems}
              users={people}
              setUsers={setPeople}
            />
          )}
        </>
      )}

      {/* Common footer for all pages */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        {currentStep === 5 ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ height: 48 }}
              onClick={() => {
                // TODO: Implement save functionality
                console.log('Saving bill...');
              }}
            >
              Save
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth 
              sx={{ height: 48 }}
              onClick={() => {
                // TODO: Implement share functionality
                console.log('Sharing bill...');
              }}
            >
              Share
            </Button>
            <Button 
              variant="contained" 
              color="info" 
              fullWidth 
              sx={{ height: 48 }}
              onClick={() => {
                // TODO: Implement copy to clipboard functionality
                console.log('Copying to clipboard...');
              }}
            >
              Copy
            </Button>
            </Box>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ height: 48, mb: 2 }}
            onClick={() => {
              switch (currentStep) {
                case 0: // Upload page
                  if (ocrImage) {
                    setCurrentStep(1);
                  }
                  break;
                case 1: // OCR breakdown
                  if (ocrText) {
                    setCurrentStep(3); // Skip to user assignment
                  } else {
                    setCurrentStep(2); // Go to manual entry if no OCR text
                  }
                  break;
                case 2: // Manual entry
                  if (manualItems.length > 0) {
                    if (!manualTax || !manualTip) {
                      setValidationAttempted(true);
                      return;
                    }
                    // Convert manual items to the main items state
                    const newItems = manualItems
                      .filter(item => item.name && item.price)
                      .map(item => ({
                        id: Date.now().toString() + Math.random(),
                        name: item.name,
                        price: parseFloat(item.price.toString()),
                        count: item.count || 1,
                        assignedUsers: [],
                        isSelected: false
                      }));
                    
                    // Only add items that don't already exist
                    const existingNames = new Set(items.map(item => item.name));
                    const uniqueNewItems = newItems.filter(item => !existingNames.has(item.name));
                    
                    if (uniqueNewItems.length > 0) {
                      setItems([...items, ...uniqueNewItems]);
                    }

                    // Calculate tip amount based on percentage or fixed amount
                    const subtotal = manualItems.reduce((sum, item) => {
                      const price = parseFloat(item.price) || 0;
                      const count = item.count || 1;
                      return sum + (price * count);
                    }, 0);
                    
                    const tipAmount = isTipPercentage 
                      ? subtotal * (parseFloat(manualTip.replace(/[^0-9.]/g, '')) / 100)
                      : parseFloat(manualTip.replace(/[^0-9.]/g, ''));

                    setReceiptSummary(prev => ({
                      ...prev,
                      subtotal,
                      tax: parseFloat(manualTax.replace(/[^0-9.]/g, '')),
                      tip: tipAmount,
                      total: subtotal + parseFloat(manualTax.replace(/[^0-9.]/g, '')) + tipAmount
                    }));

                    setCurrentStep(3); // Go to user assignment
                  }
                  break;
                case 3: // User assignment
                  if (people.length > 0) {
                    setCurrentStep(4);
                  }
                  break;
                case 4: // Items assignment
                  setShowSummary(true);
                  setCurrentStep(5); // Set to summary step
                  break;
                default:
                  setCurrentStep(currentStep + 1);
              }
            }}
          >
            Continue
          </Button>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
          <IconButton
            size="small"
            onClick={() => {
              if (currentStep > 0) {
                setShowSummary(false);
                setCurrentStep(currentStep - 1);
              }
            }}
            disabled={currentStep === 0}
            sx={{ color: 'primary.main', p: 0.5 }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
          {[0, 1, 2, 3, 4].map((step) => (
            <IconButton
              key={step}
              size="small"
              onClick={() => {
                if (step === 4) {
                  setShowSummary(true);
                } else {
                  setShowSummary(false);
                  setCurrentStep(step);
                }
              }}
              sx={{ color: (step === currentStep || (step === 4 && showSummary)) ? 'primary.main' : 'grey.400', p: 0.5 }}
            >
              {step === currentStep || (step === 4 && showSummary) ? (
                <FiberManualRecordIcon fontSize="small" />
              ) : (
                <RadioButtonUncheckedIcon fontSize="small" />
              )}
          </IconButton>
        ))}
          <IconButton
            size="small"
            onClick={() => {
              if (currentStep < 4) {
                setShowSummary(false);
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={currentStep === 4 || showSummary}
            sx={{ color: 'primary.main', p: 0.5 }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AdvancedSplit; 