import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./HomeContainer'));

export const HomePage = () => {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
};
