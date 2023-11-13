'use client';
import { SessionProvider } from 'next-auth/react';

const ProviderForSession = ({children}: {children: React.ReactNode}) => {
  return (<SessionProvider>
    {children}
  </SessionProvider>);
}

export default ProviderForSession;

// Вот эту всю историю подключаем к главному лейауту.