'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Navbar from '@/components/Navbar';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <Navbar />
    {children}
    </Provider>;
}
