import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Check as CheckIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { Person, Item } from '../../types';
import { userColors } from '../../constants/colors';
import { generateInitials } from '../../utils/stringUtils';

interface UserAssignmentProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  items: Item[];
  setItems: (items: Item[]) => void;
  users: Person[];
  setUsers: (users: Person[]) => void;
}

const UserAssignment: React.FC<UserAssignmentProps> = ({ 
  currentStep, 
  setCurrentStep, 
  items, 
  setItems,
  users,
  setUsers
}) => {
  const [newUserName, setNewUserName] = useState('');
  const [showItems, setShowItems] = useState(currentStep === 4);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentStep === 4) {
      setShowItems(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (dialogOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [dialogOpen]);

  const handleAddUser = () => {
    const trimmedName = newUserName.trim();
    if (trimmedName && !users.some(user => user.name.toLowerCase() === trimmedName.toLowerCase())) {
      const newUser: Person = {
        id: uuidv4(),
        name: trimmedName,
        initials: generateInitials(trimmedName),
        color: userColors[users.length % userColors.length],
      };
      setUsers([...users, newUser]);
      setSelectedUserId(newUser.id);
      setNewUserName('');
      setDialogOpen(false);
    }
  };

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    setSelectedUserId(null);
    setItems(items.map(item => ({
      ...item,
      assignedUsers: item.assignedUsers?.filter(userId => userId !== id)
    })));
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(selectedUserId === userId ? null : userId);
  };

  const handleItemClick = (itemId: string) => {
    if (selectedUserId) {
      setItems(items.map(item => {
        if (item.id === itemId) {
          const assignedUsers = item.assignedUsers || [];
          const isAssigned = assignedUsers.includes(selectedUserId);
          const newAssignedUsers = isAssigned
            ? assignedUsers.filter(id => id !== selectedUserId)
            : [...assignedUsers, selectedUserId];
          
          return {
            ...item,
            assignedUsers: newAssignedUsers,
            isSelected: false
          };
        }
        return item;
      }));
    }
  };

  const handleItemDoubleClick = (itemId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const newState = {
          ...item,
          isSelected: !item.isSelected,
          assignedUsers: item.isSelected ? [] : users.map(user => user.id)
        };
        return newState;
      }
      return item;
    }));
  };

  const handleMouseDown = (itemId: string) => {
    const timer = setTimeout(() => handleItemDoubleClick(itemId), 500);
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const getUserById = (id: string) => users.find(user => user.id === id);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        People
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {users.map((user) => (
          <Box
            key={user.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              cursor: 'pointer',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={() => handleUserSelect(user.id)}
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
                background: selectedUserId === user.id ? user.color : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              <Typography
                sx={{
                  color: selectedUserId === user.id ? 'white' : 'text.primary',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'color 0.2s',
                }}
              >
                {user.initials}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveUser(user.id);
              }}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Person
        </Button>
        {users.length > 0 && (
          <Button
            variant="outlined"
            startIcon={showItems ? <CheckIcon /> : <AddIcon />}
            onClick={() => setShowItems(!showItems)}
            sx={{ ml: 'auto' }}
          >
            {showItems ? 'Hide Items' : 'Show Items'}
          </Button>
        )}
      </Box>

      {showItems && users.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Items to Split
          </Typography>
          <List>
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
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
                  onMouseDown={() => handleMouseDown(item.id)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
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
                        const user = getUserById(userId);
                        if (!user) return null;
                        return (
                          <Box
                            key={userId}
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
                  <ListItemText
                    primary={
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Typography 
                          sx={{ 
                            flex: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            color: 'text.primary',
                            fontWeight: item.isSelected ? 600 : 400,
                            maskImage: 'linear-gradient(to right, #000000, #000000 70%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, #000000, #000000 70%, transparent)'
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        ${item.price.toFixed(2)} {item.count && item.count > 1 ? `× ${item.count}` : ''}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add New Person</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              inputRef={nameInputRef}
              fullWidth
              autoFocus
              error={users.some(user => user.name.toLowerCase() === newUserName.trim().toLowerCase())}
              helperText={
                users.some(user => user.name.toLowerCase() === newUserName.trim().toLowerCase())
                  ? 'This name is already taken'
                  : 'Enter the person\'s name'
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained"
            disabled={!newUserName.trim() || users.some(user => user.name.toLowerCase() === newUserName.trim().toLowerCase())}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAssignment; 