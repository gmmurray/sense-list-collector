import { Grid, List, ListItem, ListItemButton } from '@mui/material';
import React, { Fragment } from 'react';

import CenteredLoadingIndicator from '../../../shared/CenteredLoadingIndicator';
import DashboardCard from './DashboardCard';
import { IItemWithId } from '../../../../entities/item';

type Props = {
  newItems: IItemWithId[];
  favoriteItems: IItemWithId[];
  loading: boolean;
  onSelect: (id: string) => any;
};

export default function DashboardItemsCards({
  newItems,
  favoriteItems,
  loading,
  onSelect,
}: Props) {
  if (loading) {
    return (
      <Grid item xs={12}>
        <CenteredLoadingIndicator height="20vh" size={40} />
      </Grid>
    );
  }

  if (newItems.length === 0 && favoriteItems.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <DashboardCard title="Latest items" xs={12} hide={newItems.length === 0}>
        <List>
          {newItems.map(item => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => onSelect(item.id)}>
                {item.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DashboardCard>
      <DashboardCard
        title="Favorite Items"
        xs={12}
        hide={favoriteItems.length === 0}
      >
        <List>
          {favoriteItems.map(item => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => onSelect(item.id)}>
                {item.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DashboardCard>
    </Fragment>
  );
}
