import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Collapse, IconButton, TextField, Divider } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { Item, Person } from './AdvancedSplit';

interface SummaryPageProps {
  items: Item[];
  users: Person[];
  onBack: () => void;
  taxAmount: number;
  receiptSummary: {
    subtotal: number;
    tax: number;
    total: number;
    tip: number;
    date: string;
    merchant: string;
    originalImage: File | string | null;
  };
}

const SummaryPage: React.FC<SummaryPageProps> = ({ items, users, onBack, taxAmount, receiptSummary }) => {
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [showImage, setShowImage] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(20);

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

  // Calculate total amount for each user
  const userTotals = users.map(user => {
    const userItems = items.filter(item => item.assignedUsers?.includes(user.id));
    const subtotal = userItems.reduce((sum: number, item: Item) => {
      // If item is shared between multiple users, split the cost
      const sharedWithCount = item.assignedUsers?.length || 1;
      return sum + ((item.price * (item.count || 1)) / sharedWithCount);
    }, 0);
    const tip = (subtotal / receiptSummary.subtotal) * (receiptSummary.subtotal * (tipPercentage / 100));
    const tax = receiptSummary.tax > 0 ? (subtotal / receiptSummary.subtotal) * receiptSummary.tax : 0;
    const total = subtotal + tip + tax;
    return { user, subtotal, tip, tax, total };
  });

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
          <Collapse in={showImage}>
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
          <Box key={user.id}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                p: 1,
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => handleExpand(user.id)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: user.color }} />
                <Typography>{user.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>${total.toFixed(2)}</Typography>
                {expandedUsers.has(user.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
            </Box>
            <Collapse in={expandedUsers.has(user.id)}>
              <Box sx={{ pl: 2, py: 1 }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight="bold">Total:</Typography>
                  <Typography variant="body2" fontWeight="bold">${total.toFixed(2)}</Typography>
                </Box>
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SummaryPage; 