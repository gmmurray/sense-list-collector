import { GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { getUserDocument, initializeUserDocument } from '../entities/user';

import { USER_DOCUMENT_NOT_FOUND_ERROR } from '../lib/constants/errors';

export const firebaseUiConfig: firebaseui.auth.Config = {
  signInSuccessUrl: '/',
  signInOptions: [
    GithubAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // create user documents when a user signs in for the first time
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      const userId = authResult.user.uid;
      getUserDocument(userId).catch(error => {
        if (error && error.code === USER_DOCUMENT_NOT_FOUND_ERROR.code) {
          initializeUserDocument(userId);
        }
      });

      return false;
    },
  },
};
