import { AuthOptions, User } from "next-auth";
import GoggleProvider from "next-auth/providers/google"; // Любой провайдер - функция в которую нужно передать набор настроек.

// Это ревкизиты для входа. Возможность ввести логин и пароль.
import Credentials from "next-auth/providers/credentials";
import { users } from '@/data/users';

export const authConfig: AuthOptions = {
  providers: [
    // Минимальный набор настроек. Они нужны что бы гугл сделал свою работу.
    GoggleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    // Минимально 2 опции
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
        if (!credentials?.email || !credentials?.password) return null;

        // Здесь сценарий работы с базой данных.
        const currentUser = users.find(user => user.email === credentials.email);

        if( currentUser && currentUser.password === credentials.password ) {
          const { password, ...userWithoutPass} = currentUser;

          return userWithoutPass as User;
        }

        return null;
      },
    }),
  ],
  // Указываем страницу для авторизации для редиректа, при попытке зайти на приватный роут.
  pages: {
    signIn: '/signin'
  }
};

/*
  Заходим в cloud.google.com -> console -> APIs & Services -> Выбираем/создаем проект -> Credentials -> Create Credentials -> OAuth client ID -> Пройти нудный опрос от гугла о приложение (скорей всего что-то не так) -> Create OAuth client ID и опять заполняем (тип приложение, имя приложения, адрес где будет распологаться наше приложение:port) -> Также нужно указать путь для редиректа http://localhost:3000/api/auth/callback/google (для гугла). Жемем Create.

  Когда мы работает в next-auth, то у нас есть набор готовых роутов. Когда будем поключать другие сервися для авторизации, то будем использоваь не /google, а /github.

  Копируем в .env.local Client ID и Client Secret. Добавляем их в GoogleProvider и минимальная конфигурация у нас есть. Нужно добавить объект authConfig в /api/auth/[...nextauth]/route.ts

*/
