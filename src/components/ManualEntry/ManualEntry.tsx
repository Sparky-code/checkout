import React from 'react';
import { Box, Typography, TextField, Button, Switch } from '@mui/material';
import { Item } from '../../types';

interface ManualItem {
  name: string;
  price: string;
  count: number;
}

interface ManualEntryProps {
  items: Item[];
  setItems: (items: Item[]) => void;
  manualItems: ManualItem[];
  setManualItems: (items: ManualItem[]) => void;
  manualTax: string;
  setManualTax: (tax: string) => void;
  manualTip: string;
  setManualTip: (tip: string) => void;
  isTipPercentage: boolean;
  setIsTipPercentage: (isPercentage: boolean) => void;
  validationAttempted: boolean;
  setValidationAttempted: (attempted: boolean) => void;
}

const ManualEntry: React.FC<ManualEntryProps> = ({
  items,
  setItems,
  manualItems,
  setManualItems,
  manualTax,
  setManualTax,
  manualTip,
  setManualTip,
  isTipPercentage,
  setIsTipPercentage,
  validationAttempted,
  setValidationAttempted,
}) => {
  const calculateSubtotal = () => {
    return manualItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const count = item.count || 1;
      return sum + (price * count);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = parseFloat(manualTax) || 0;
    const tipAmount = isTipPercentage
      ? subtotal * (parseFloat(manualTip) || 0) / 100
      : parseFloat(manualTip) || 0;
    return subtotal + tax + tipAmount;
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Enter Items Manually</Typography>
      {manualItems.map((item, idx) => (
        <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }} key={idx}>
          <Box sx={{ width: '41.666%' }}>
            <TextField
              label="Name"
              value={item.name}
              onChange={e => {
                const newItems = [...manualItems];
                newItems[idx].name = e.target.value;
                setManualItems(newItems);
              }}
              fullWidth
            />
          </Box>
          <Box sx={{ width: '25%' }}>
            <TextField
              label="Price"
              value={item.price}
              onChange={e => {
                const newItems = [...manualItems];
                newItems[idx].price = e.target.value.replace(/[^0-9.]/g, '');
                setManualItems(newItems);
              }}
              fullWidth
              inputProps={{ inputMode: 'decimal', pattern: '[0-9.]*' }}
            />
          </Box>
          <Box sx={{ width: '16.666%' }}>
            <TextField
              label="Count"
              value={item.count}
              onChange={e => {
                const newItems = [...manualItems];
                newItems[idx].count = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 1;
                setManualItems(newItems);
              }}
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Box>
          <Box sx={{ width: '16.666%' }}>
            <Button 
              color="error" 
              onClick={() => setManualItems(manualItems.filter((_, i) => i !== idx))}
            >
              Remove
            </Button>
          </Box>
        </Box>
      ))}
      <Button 
        onClick={() => setManualItems([...manualItems, { name: '', price: '', count: 1 }])} 
        sx={{ mt: 1 }}
      >
        Add Item
      </Button>

      {/* Summary Section */}
      <Box sx={{ mt: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6" mb={2}>Summary</Typography>
        
        {/* Subtotal */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>Subtotal:</Typography>
          <Typography>${calculateSubtotal().toFixed(2)}</Typography>
        </Box>

        {/* Tax */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <Typography>Tax:</Typography>
          <TextField
            size="small"
            value={manualTax}
            onChange={e => setManualTax(e.target.value.replace(/[^0-9.]/g, ''))}
            required
            error={!manualTax && validationAttempted}
            helperText={!manualTax && validationAttempted ? "Required" : ""}
            inputProps={{ 
              style: { textAlign: 'right', width: '60px' },
              inputMode: 'decimal',
              pattern: '[0-9.]*'
            }}
            sx={{ width: '80px' }}
            aria-label="Tax:"
          />
          <Typography>$</Typography>
        </Box>

        {/* Tip */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <Typography>Tip:</Typography>
          <TextField
            size="small"
            value={manualTip}
            onChange={e => setManualTip(e.target.value.replace(/[^0-9.]/g, ''))}
            required
            error={!manualTip && validationAttempted}
            helperText={!manualTip && validationAttempted ? "Required" : ""}
            inputProps={{ 
              style: { textAlign: 'right', width: '60px' },
              inputMode: 'decimal',
              pattern: '[0-9.]*'
            }}
            sx={{ width: '80px' }}
            aria-label="Tip:"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption">$</Typography>
            <Switch
              size="small"
              checked={isTipPercentage}
              onChange={() => setIsTipPercentage(!isTipPercentage)}
            />
            <Typography variant="caption">%</Typography>
          </Box>
        </Box>

        {/* Total */}
        {manualTax && manualTip && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1">Total:</Typography>
            <Typography variant="subtitle1">
              ${calculateTotal().toFixed(2)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ManualEntry; 