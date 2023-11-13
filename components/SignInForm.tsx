'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FormEvent } from 'react';

const SignInForm = () => {
  // Импорт из 'next-navigation'. Это новый хук и он обязательно должен быть из указанного модуля.
  const router = useRouter();

  const pathForRedirect = useSearchParams().get('callbackUrl') || 'profile';

  // Почему обработчик асинхронный?
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Почему await? Здесь мы указывам уже не гугл провайдер при входа, а 'credantials'
    // Как я понял данные отсюда направятся в функцию authorize, из config/auth.js.
    const res = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false, // В случае ошибки, отправит на изначальную форму авторизации, по этому отключаем
    });

    // Если результат есть и в нем нет ошибки то пушим 
    if (res && !res.error) {
      router.push(pathForRedirect);
    } else {
      console.log(res);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name='email' required />
      <input type='password' name='password' required />
      <button type='submit'>
        SignIn
      </button>
    </form>
  );
}
 
export default SignInForm;