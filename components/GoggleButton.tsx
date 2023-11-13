'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const GoogleButton = () => {
  // Используем хук, так что здесь обязательно 'use client'. Этот хук из 'next-navigation'.
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  return (
    // Для signIn нужно указать провайдера и опционально можно указать куда редиректнися юзер после входа
    <button onClick={() => {signIn('google', {callbackUrl})}}>
      SignIn in with Google
    </button>
  );
}
export default GoogleButton;