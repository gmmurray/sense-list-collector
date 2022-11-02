import { Grid, Paper, PaperProps, Typography } from '@mui/material';
import { GridSize, SxProps } from '@mui/system';
import React, { PropsWithChildren } from 'react';

type Props = {
  xs: GridSize;
  sx?: SxProps;
  title: string;
  hide?: boolean;
} & PropsWithChildren;
export default function DashboardCard(props: Props) {
  if (props.hide) return null;

  return (
    <Grid item xs={props.xs}>
      <Paper sx={{ ...(props.sx ?? {}), p: 2 }}>
        <Typography variant="h5">{props.title}</Typography>
        {props.children}
      </Paper>
    </Grid>
  );
}
