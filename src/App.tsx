import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, IconButton, useMediaQuery, Box, Tabs, Tab, Switch, FormControlLabel } from '@mui/material';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import React, { useMemo, useState } from 'react';
import BasicSplit from './BasicSplit';
import AdvancedSplit from './AdvancedSplit';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#181a1b' : '#f4f6fa',
        paper: darkMode ? '#23272f' : '#fff',
      },
    },
  }), [darkMode]);

  const location = useLocation();
  const navigate = useNavigate();
  const tabValue = location.pathname.startsWith('/advanced') ? 'advanced' : 'basic';

  const handleTabChange = (_: any, newValue: string) => {
    navigate(newValue === 'basic' ? '/basic' : '/advanced');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bill Splitter
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Brightness7 sx={{ opacity: darkMode ? 0.4 : 1, fontSize: 20, mr: 1 }} />
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(m => !m)}
              sx={{ mx: 1 }}
              inputProps={{ 'aria-label': 'toggle dark mode' }}
            />
            <Brightness4 sx={{ opacity: darkMode ? 1 : 0.4, fontSize: 20, ml: 1 }} />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          bgcolor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <Container
          maxWidth="xs"
          disableGutters
          sx={{
            mt: 1.5,
            backgroundColor: theme.palette.background.paper,
            borderRadius: { xs: 0, sm: 3 },
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            boxShadow: { xs: 0, sm: 3 },
            p: { xs: 1.5, sm: 4 },
            width: '100%',
            minHeight: { xs: '100vh', sm: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              minHeight: 44,
              height: 44,
              mb: 0,
              background: 'none',
              borderBottom: `1px solid ${theme.palette.divider}`,
              p: 0,
            }}
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <Tab
              label="Basic"
              value="basic"
              sx={{
                minHeight: 44,
                height: 44,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                bgcolor: tabValue === 'basic' ? theme.palette.background.paper : theme.palette.background.paper,
                color: tabValue === 'basic' ? 'text.primary' : 'text.secondary',
                zIndex: tabValue === 'basic' ? 2 : 1,
                border: tabValue === 'basic'
                  ? `2px solid ${theme.palette.primary.main}`
                  : 'none',
                borderBottom: tabValue === 'basic' ? 'none' : `1px solid ${theme.palette.divider}`,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderTop: tabValue === 'basic' ? `1px solid ${theme.palette.primary.main}` : 'none',
                borderLeft: tabValue === 'basic' ? `1px solid ${theme.palette.primary.main}` : 'none',
                borderRight: tabValue === 'basic' ? `1px solid ${theme.palette.primary.main}` : 'none',
                boxShadow: 'none',
                transition: 'background 0.2s',
              }}
            />
            <Tab
              label="Advanced"
              value="advanced"
              sx={{
                minHeight: 44,
                height: 44,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                bgcolor: tabValue === 'advanced' ? theme.palette.background.paper : theme.palette.background.paper,
                color: tabValue === 'advanced' ? 'text.primary' : 'text.secondary',
                zIndex: tabValue === 'advanced' ? 2 : 1,
                border: tabValue === 'advanced'
                  ? `2px solid ${theme.palette.primary.main}`
                  : 'none',
                borderBottom: tabValue === 'advanced' ? 'none' : `1px solid ${theme.palette.divider}`,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderTop: tabValue === 'advanced' ? `2px solid ${theme.palette.primary.main}` : 'none',
                borderLeft: tabValue === 'advanced' ? `2px solid ${theme.palette.primary.main}` : 'none',
                borderRight: tabValue === 'advanced' ? `2px solid ${theme.palette.primary.main}` : 'none',
                boxShadow: 'none',
                transition: 'background 0.2s',
              }}
            />
          </Tabs>
          <Box sx={{ pt: 2 }}>
            <Routes>
              <Route path="/basic" element={<BasicSplit />} />
              <Route path="/advanced" element={<AdvancedSplit />} />
              <Route path="*" element={<BasicSplit />} />
            </Routes>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
