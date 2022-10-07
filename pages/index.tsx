import type { NextPage } from 'next';
import { firebaseAuth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LandingPage: NextPage = () => {
  const [user] = useAuthState(firebaseAuth);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [router, user]);
  return (
    <div>
      <h1>landing page!</h1>
    </div>
  );
};

export default LandingPage;
