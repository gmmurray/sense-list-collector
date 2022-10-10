import { Box, useTheme } from '@mui/system';
import { Fade, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';

type ResponsiveTabPageProps = {
  pages: { component: React.ReactNode; tabLabel: string; pageLabel?: string }[];
};

const ResponsiveTabPage = ({ pages }: ResponsiveTabPageProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [tabValue, setTabValue] = useState(0);

  const currentPage = pages[tabValue];

  if (!currentPage) return null;

  return (
    <Box
      sx={isSmallScreen ? undefined : { flexGrow: 1, display: 'flex' }}
      width="100%"
      minHeight="50vh"
    >
      <Tabs
        orientation={isSmallScreen ? 'horizontal' : 'vertical'}
        variant={isSmallScreen ? 'fullWidth' : 'scrollable'}
        onChange={(e, value) => setTabValue(value)}
        value={tabValue}
        sx={
          isSmallScreen
            ? undefined
            : { borderRight: 1, borderColor: 'divider', mt: 6 }
        }
      >
        {pages.map(p => (
          <Tab key={p.tabLabel} label={p.tabLabel} />
        ))}
      </Tabs>
      <Box
        sx={{
          mt: 2,
          ml: isSmallScreen ? undefined : 6,
          flex: 1,
        }}
      >
        <Typography variant="h2" gutterBottom>
          {currentPage.pageLabel ?? currentPage.tabLabel}
        </Typography>
        {currentPage.component}
      </Box>
    </Box>
  );
};

export default ResponsiveTabPage;
