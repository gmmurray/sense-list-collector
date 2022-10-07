import { AuthPageSettings } from '../../types/authTypes';
import React from 'react';
import UserContextProvider from './UserContextProvider';

const withUser =
  (Component: any, settings?: AuthPageSettings) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }: any) =>
    (
      <UserContextProvider settings={settings}>
        <Component {...props} />
      </UserContextProvider>
    );

export default withUser;
