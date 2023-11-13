## Auth.js

### 1) Анонс:

`Auth.js` это бывший `Next Auth`. В скором времени будет поддерживать не только `Next`.

Мы будем пользоваться библитокой из `'next-auth'`.

Установим библиотеку:

```bash
npm i next-auth
```

### 2) Настройка Next Auth:

1 - Первое что нужно сделать это создать роут: `/api/auth/[...nextauth]` - эту группу динамических путей будет использовать библиотека `Next-auth`, создавая нужное количество роутов, а в нем `route.ts`:

```javascript
// app/api/auth/[...nextauth]/route.ts
import { authConfig } from "@/configs/auth"; // <- Это объект конфигурации.
import NextAuth from "next-auth/next"; // <- Это функция конструирующая обработчик запроса.

// Это обработчик пути.
const handler = NextAuth(authConfig); // <- Сюда передаем конфигурационный объект.

export { handler as GET, handler as POST }; // Это то что нужно самой библиотеке. Здесь GET и POST hendler.
```

2 - Нужно создать конфигурационный объект для того что бы создать из него `handler`:

```javascript
// configs/auth.ts
import { AuthOptions } from 'next-auth'; // <- Это тип объекта конфигурации.
import GoggleProvider from 'next-auth/providers/google'; // <- Гугл провайдер для авторизации.

// Этот объект помещаем в app/api/auth/[...nextauth]/route.ts
export const authConfig: AuthOptions = {
  providers: [
    // Это минимальный набор.
    GoggleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string, // Получим в cloud.google.com
      clientSecret: process.env.GOOGLE_SECRET as string,
    })
  ]
}
```

3 - Заходим в `cloud.google.com` -> `console` -> `APIs & Services` -> Выбираем/создаем проект -> `Credentials` -> `Create Credentials` -> `OAuth client ID` -> Пройти нудный опрос от гугла -> `Create OAuth client ID` и опять заполняем (тип приложение, имя приложения, адрес где будет распологаться наше приложение:port) -> Также нужно указать путь для редиректа `http://localhost:3000/api/auth/callback/google` (для гугла) -> `Create`.

Когда мы работаем в `next-auth`, то у нас есть набор готовых роутов. Для подключения других сервисов авторизации будем использоваь не `/google`, а `/github`.

Нам выдадут два ключа - копируем в `.env.local` полученные `Client ID` и `Client Secret`. Добавляем их в `GoogleProvider` и минимальная конфигурация у нас есть.

4 - Также в `.env.local` нужно добавить две переменные:

```shell
NEXTAUTH_SECRET="supersecret"
NEXTAUTH_URL="http://localhost:3000"
```

Данные переменные будут использоваться для нужд библиотеки `next-auth`. Одна для создания токенов. Другая с адресом `Origin`

(Все продаленное делает доступным маршрут `/api/auth/signin`. Путь можно поместить в линк для входа в приложение)

### 3) Проверка сессии:

Для того что бы узнать статус авторизации в **_клиентском компоненте_** нужно воспользоваться хуком `useSession()` из `'next-auth/react'`, который вернет объект:

```javascript
{
  data: {
    expires: '2023-01-01T01:01:01.001Z',
    user: {
      email: "channelbodhi@gmail.com",
      image: "https://lh3.googleusercontent.com/a/ACg8ocJvQiULoeS7VW-U-4K-vCjrCFc8EZpwni96S5HCaas92i8=s96-c"
      name:"Bodhi"
    }
  },
  status: "authenticated",
  update: () => {}, // <- Функци
}
```

На основе этого объекта мы можем возвращать разную разметку, но предже приложение нужно обернуть провайдером сессий:

```javascript
"use client";
import { SessionProvider } from "next-auth/react";

const ProviderForSession = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ProviderForSession;
```

Далее просто оборачиваем в корневом `layout.tsx` наше приложение в этот провайдер.

(Важно! Провайдер должен быть клиентским компонентом)

Также из `'next-auth/react'` можно импортировать еще две функции:

```javascript
import {
  useSession, // <- Объект с данными
  signIn,     // <- Функция входа. Но мы используем линк со ссылкой
  signOut,    // <- Функция выхода. Используетсяна кнопке Signout
} from "next-auth/react";
```

Функция `singOut()` принимает объект с настройками. Например `singOut({callbackUrl: "/"})` вернет пользователя на главную страницу после выхода.

(Серверные компоненты тоже могут получить статус авторизации, но об этом позже)


### 4) Профиль пользователя. Серверный компонент старницы и проверка сессии через getServerSession:

#### Приватные роуты:
В корне проекта нужно создать `middleware.ts` в котором мы делаем реэкспорт из библиотеки `'next-auth/middleware'`:

```javascript
// /middleware.ts
export { default } from 'next-auth/middleware'; // Так написано в документации =(

// Эти страницы будут приватными и зайдя на них мы будем переадресованы на  /api/auth/signig/callbackURL(веренмся назад после аутентификации).
export const config = {matcher: ['/profile', '/protected/:path*']};
```

### 5) Форма авторизации через Credentials:

```javascript
export const authConfig: AuthOptions = {
  providers: [
    GoggleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    // Credentials это функция импортированная из 'next-auth/providers/credentials'. Типа провайдер...
    // В функцию передеаем объект,который описываем реквизиты входа.
    // Это автоматически создатс форму входа с email и password. Куда мы возвращаем данные из функции authorize???
    Credentials({
      credentials: {
        email: {
          label: "email",
          type: "email",
          required: true,
        },
        password: {
          label: "password",
          type: "password",
          required: true,
        },
      },
      // Должна получить криденшиалы, проверить авторизованы мы или нет и вернуть по выбору
      async authorize(credentials) {
        // Если не ввели email или пароль возвращаем null.
        if (!credentials?.email || !credentials?.password) return null;

        // Здесь сценарий работы с базой данных. Проверка пароль в записи юзера.
        const currentUser = users.find(user => user.email === credentials.email);

        // Если получили юзура и его пассворд подходит то возвращаем объект этого юзера, но без паролья. Есть специальный тип из 'next-auth'.
        if( currentUser && currentUser.password === credentials.password ) {
          const { password, ...userWithoutPass} = currentUser;

          return userWithoutPass as User;
        }

        // По дефолту необходимо вернуть. Сюда недойдет если пользовтель найдется.
        return null;
      },
    }),
  ],
  // На это этапе пока ненужно, но для создания кастомной страницы входа необходимо.
  pages: {
    signIn: '/signin'
  }
};
```

### 6) Кастомная кнопка для входа в Google:

(Форма входа должна быть клиентским компоненом)

```javascript
'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const GoogleButton = () => {
  const searchParams = useSearchParams(); // Достаём значение callbackUrl.
  const callbackUrl = searchParams.get('callbackUrl') || '/profile'; // Либо используем резервное.

  return (
    // Для signIn нужно указать провайдера и опционально можно указать куда редиректнися юзер после входа
    <button onClick={() => {signIn('google', {callbackUrl})}}>
      SignIn in with Google
    </button>
  );
}
export default GoogleButton;
```

### 7) Форма для ввода Credentials:

Смотреть компонент `SignInForm`.

А далее просто собираем эти компоненты в страницу. (страница у нас серверная)

```javascript
import GoogleButton from "@/components/GoggleButton";
import SignInForm from "@/components/SignInForm";

const Signin = () => {
  return (
    <div className="stack">
      <h1>SignIn</h1>
      <GoogleButton />
      <p>or</p>
      <SignInForm />
    </div>
  );
};

export default Signin;
```

### Доп:

Если бы мы делали защищенные `API Routes`, то могли бы использовать там функцию getServerSession. (Можно передать `Request`, `Response`)
