import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExperiencePreferences from './ExperiencePreferences';
import ItemCategoryPreferences from './ItemCategoryPreferences';
import React from 'react';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';

const UserPreferencesPage = () => {
  const { documentUser } = useUserContext();

  if (!documentUser) return null;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Item categories</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ItemCategoryPreferences />
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Experience</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ExperiencePreferences />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserPreferencesPage;
