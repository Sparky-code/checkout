import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, IconButton, TextField, InputAdornment } from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Item, Person } from '../../types';

interface ItemAssignmentProps {
  items: Item[];
  setItems: (items: Item[]) => void;
  users: Person[];
}

const ItemAssignment: React.FC<ItemAssignmentProps> = ({ items, setItems, users }) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          isSelected: !item.isSelected
        };
      }
      return item;
    }));
  };

  const handleItemDoubleClick = (itemId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          isSelected: !item.isSelected,
          assignedUsers: item.isSelected ? [] : users.map(user => user.id)
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleAddItem = () => {
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
  };

  const handleItemEdit = (itemId: string, field: keyof Item, value: any) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    }));
  };

  const handleAssignUser = (itemId: string, userId: string) => {
    // ... existing code ...
  };

  const renderItem = (item: Item) => {
    const formattedPrice = `$${item.price.toFixed(2)}`;
    const itemCount = item.count !== undefined ? item.count : 1;
    const displayText = itemCount > 1 ? `${item.name} × ${itemCount}` : item.name;

    return (
      <ListItemText
        primary={displayText}
        secondary={formattedPrice}
      />
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Items to Split
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              cursor: 'pointer',
              position: 'relative',
              pl: 0,
              pr: 0,
              minHeight: 48,
              display: 'flex',
              alignItems: 'stretch',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={() => handleItemClick(item.id)}
            onDoubleClick={() => handleItemDoubleClick(item.id)}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'stretch',
                gap: 0.5,
                p: 0.5,
                flexShrink: 0,
                width: 'auto',
              }}
            >
              {item.isSelected ? (
                <Box
                  sx={{
                    height: '100%',
                    width: 4,
                    background: '#4CAF50',
                    borderRadius: 1,
                  }}
                />
              ) : (
                item.assignedUsers?.map(userId => {
                  const user = users.find(u => u.id === userId);
                  if (!user) return null;
                  return (
                    <Box
                      key={userId}
                      data-testid="assignment-indicator"
                      sx={{
                        height: '100%',
                        width: 4,
                        background: user.color,
                        borderRadius: 1,
                      }}
                    />
                  );
                })
              )}
            </Box>
            {editingItemId === item.id ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setEditingItemId(null);
                  }
                }}
              >
                <TextField
                  size="small"
                  placeholder="Count"
                  defaultValue={item.count || 1}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleItemEdit(item.id, 'count', parseInt(value) || 1);
                  }}
                  inputProps={{ 
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    style: { 
                      width: 40,
                      padding: '8px 0',
                      border: 'none',
                      borderBottom: '0.5px solid rgba(0, 0, 0, 0.35)',
                      borderRadius: 0
                    }
                  }}
                />
                <TextField
                  size="small"
                  placeholder="Item name"
                  defaultValue={item.name}
                  onChange={(e) => handleItemEdit(item.id, 'name', e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  placeholder="Price"
                  defaultValue={item.price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    handleItemEdit(item.id, 'price', parseFloat(value) || 0);
                  }}
                  inputProps={{ 
                    inputMode: 'decimal',
                    pattern: '[0-9.]*',
                    style: { 
                      width: 80,
                      padding: '8px 0',
                      border: 'none',
                      borderBottom: '0.5px solid rgba(0, 0, 0, 0.35)',
                      borderRadius: 0
                    }
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveItem(item.id)}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main'
                    }
                  }}
                >
                  <DeleteIcon />
                  <Typography sx={{ ml: 1 }}>Remove</Typography>
                </IconButton>
              </Box>
            ) : (
              <>
                <Typography sx={{ width: 40, fontSize: 13 }}>{item.count || 1}</Typography>
                <Typography sx={{ flex: 1, fontSize: 13 }}>{item.name}</Typography>
                <Typography sx={{ width: 80, fontSize: 13 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.count > 1 ? `$${item.price.toFixed(2)} × ${item.count}` : `$${item.price.toFixed(2)}`}
                  </Typography>
                </Typography>
                <IconButton
                  size="small"
                  edge="end"
                  aria-label="remove"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <DeleteIcon />
                  <Typography sx={{ ml: 1 }}>Remove</Typography>
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <Button
        variant="text" 
        color="primary" 
        onClick={handleAddItem}
        sx={{ 
          textTransform: 'none',
          fontSize: 14,
          mb: 2
        }}
      >
        Add additional items
      </Button>
    </Box>
  );
};

export default ItemAssignment; 