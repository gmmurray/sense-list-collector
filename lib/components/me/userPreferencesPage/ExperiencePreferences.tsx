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
import { IUserDocument } from '../../../../entities/user';
import { useSnackbarAlert } from '../../shared/SnackbarAlert';
import { useUpdateUserExperienceMutation } from '../../../queries/users/userMutations';
import { useUserContext } from '../../../hoc/withUser/userContext';

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
      <ListItem>
        <ListItemText primary="Prefer table view" />
        <ListItemSecondaryAction>
          <IconButton
            disabled={updateMutation.isLoading}
            onClick={() =>
              handleChange(
                'preferTables',
                !documentUser?.experience?.preferTables,
              )
            }
          >
            {documentUser?.experience?.preferTables ? (
              <CheckBoxIcon />
            ) : (
              <CheckBoxOutlineBlankIcon />
            )}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default ExperiencePreferences;
