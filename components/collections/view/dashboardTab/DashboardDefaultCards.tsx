import React, { Fragment } from 'react';
import { SxProps, Typography } from '@mui/material';

import DashboardCard from './DashboardCard';
import { ICollectionWithId } from '../../../../entities/collection';
import { getDateStringFromFirestoreTimestamp } from '../../../../lib/helpers/firestoreHelpers';

const sx: SxProps = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

type Props = {
  collection: ICollectionWithId;
};

export default function DashboardDefaultCards({ collection }: Props) {
  return (
    <Fragment>
      <DashboardCard xs={6} sx={sx} title="Item count">
        <Typography variant="subtitle1" sx={{ mt: 'auto' }}>
          {collection.itemIds.length}
        </Typography>
      </DashboardCard>
      <DashboardCard xs={6} sx={sx} title="Last updated">
        <Typography variant="subtitle1" sx={{ mt: 'auto' }}>
          {getDateStringFromFirestoreTimestamp(collection.updatedAt)}
        </Typography>
      </DashboardCard>
    </Fragment>
  );
}
