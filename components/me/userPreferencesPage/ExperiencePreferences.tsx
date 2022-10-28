import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import React, { useCallback } from 'react';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { IUserDocument } from '../../../entities/user';
import { useSnackbarAlert } from '../../shared/SnackbarAlert';
import { useUpdateUserExperienceMutation } from '../../../lib/queries/users/userMutations';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';
import { userExperiencePreferences } from '../../../lib/constants/userExperiencePreferences';

const ExperiencePreferences = () => {
  const snackbar = useSnackbarAlert();
  const { documentUser } = useUserContext();

  const updateMutation = useUpdateUserExperienceMutation();

  const handleChange = useCallback(
    async (key: keyof IUserDocument['experience'], value: boolean) => {
      if (!documentUser) return;
      try {
        await updateMutation.mutateAsync({
          key,
          value,
          userId: documentUser.userId,
        });
      } catch (error) {
        console.log(error);
        snackbar.send('Error updating user experience', 'error');
      }
    },
    [documentUser, snackbar, updateMutation],
  );

  return (
    <List>
      {userExperiencePreferences.map(pref => (
        <ListItem key={pref.key}>
          <ListItemText primary={pref.primary} secondary={pref.secondary} />
          <ListItemSecondaryAction>
            <IconButton
              disabled={updateMutation.isLoading}
              onClick={() =>
                handleChange(pref.key, !documentUser?.experience[pref.key])
              }
            >
              {documentUser?.experience[pref.key] ? (
                <CheckBoxIcon />
              ) : (
                <CheckBoxOutlineBlankIcon />
              )}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default ExperiencePreferences;
