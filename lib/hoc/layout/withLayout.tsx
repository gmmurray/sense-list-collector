/* eslint-disable react/display-name */

import { Box, Container } from '@mui/material';

import CreateProfileDialog from '../../../components/layout/CreateProfileDialog';
import Footer from '../../../components/layout/Footer';
import Navbar from '../../../components/layout/Navbar';

type LayoutSettings = {
  useCustomContainer?: boolean;
  isPublicPage?: boolean;
};

const withLayout =
  (Component: any, settings?: LayoutSettings) =>
  ({ ...props }: any) => {
    const renderComponent = () => <Component {...props} />;

    const renderContent = () => {
      if (settings && settings.useCustomContainer) {
        return renderComponent();
      }

      return (
        <Container maxWidth="xl" sx={{ pb: 2 }}>
          {renderComponent()}
        </Container>
      );
    };

    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Navbar isPublicPage={settings && settings.isPublicPage} />
        {renderContent()}
        <Footer />
        <CreateProfileDialog />
      </Box>
    );
  };

export default withLayout;
