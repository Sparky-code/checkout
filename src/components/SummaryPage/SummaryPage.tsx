import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Collapse, IconButton, TextField, Divider } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { SummaryPageProps } from './types';
import { useSummaryCalculations } from './hooks/useSummaryCalculations';

const SummaryPage: React.FC<SummaryPageProps> = ({ 
  items, 
  users, 
  onBack, 
  taxAmount, 
  receiptSummary 
}) => {
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [showImage, setShowImage] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(20);

  const userTotals = useSummaryCalculations(items, users, {
    subtotal: receiptSummary.subtotal,
    tax: receiptSummary.tax,
    tip: receiptSummary.tip
  });

  const handleExpand = (userId: string) => {
    setExpandedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setTipPercentage(parseFloat(value) || 0);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {receiptSummary.merchant || 'Bill Summary'}
      </Typography>
      
      {receiptSummary.originalImage && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowImage(!showImage)}
            startIcon={showImage ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ mb: 1 }}
          >
            {showImage ? 'Hide Original Bill' : 'Show Original Bill'}
          </Button>
          <Collapse in={showImage} data-testid="bill-image-collapse">
            <Box
              component="img"
              src={typeof receiptSummary.originalImage === 'string' 
                ? receiptSummary.originalImage 
                : URL.createObjectURL(receiptSummary.originalImage)}
              alt="Original bill"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                boxShadow: 1
              }}
            />
          </Collapse>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Items
        </Typography>
        <List>
          {items.map((item) => (
            <ListItem key={item.id} sx={{ py: 1 }}>
              <ListItemText
                primary={item.name}
                secondary={`$${item.price.toFixed(2)}${item.count && item.count > 1 ? ` × ${item.count}` : ''}`}
              />
              <ListItemSecondaryAction>
                <Typography variant="body2" color="text.secondary">
                  {item.assignedUsers?.length || 0} assigned
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>${receiptSummary.subtotal.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Tax:</Typography>
          <Typography>${receiptSummary.tax.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Tip:</Typography>
          <Typography>${receiptSummary.tip.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontWeight: 'bold' }}>
          <Typography>Total:</Typography>
          <Typography>${receiptSummary.total.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Per Person
        </Typography>
        {userTotals.map(({ user, subtotal, tip, tax, total }) => (
          <Box key={user.id} sx={{ mb: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                mb: 1
              }}
              onClick={() => handleExpand(user.id)}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${user.color}`,
                  mr: 1
                }}
              >
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  {user.initials}
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                {user.name}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                ${total.toFixed(2)}
              </Typography>
              <IconButton size="small">
                {expandedUsers.has(user.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={expandedUsers.has(user.id)}>
              <Box sx={{ pl: 7 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                  <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Tax:</Typography>
                  <Typography variant="body2">${tax.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Tip:</Typography>
                  <Typography variant="body2">${tip.toFixed(2)}</Typography>
                </Box>
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={onBack}
        sx={{ mt: 2 }}
      >
        Back
      </Button>
    </Box>
  );
};

export default SummaryPage; 