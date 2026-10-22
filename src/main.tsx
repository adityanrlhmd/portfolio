import React, { Suspense, lazy } from 'react';

import ReactDOM from 'react-dom/client';

import { Spinner } from '@/components/ui/spinner';

import App from './App.tsx';
import './index.css';

// Its own chunk, so the PDF library never loads on the home page
// eslint-disable-next-line react-refresh/only-export-components
const ResumePage = lazy(() => import('@/pages/resume/resume-page'));

const isResume = window.location.pathname.replace(/\/$/, '') === '/resume';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isResume ? (
      <Suspense fallback={<Spinner className="m-auto mt-[40svh] size-6" />}>
        <ResumePage />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
