/*
  Делаем компонент серверным:
  При обращение к серверу, функция getServerSession принимает объект authConfig, в котором мы инициировали провайдеры с ключами.
  На основе этого конфига делается запрос на получение профиля.
  Возращается такой же объект как через useSession. (Но как здесь работает асинхронность? В первый раз ведь приходит "status": "loading")
  Вообщем мы получаем данные пользователя как объект и на его основе можем конструировать страницу. Ну либо не получаем ничего.
*/

import { authConfig } from '@/configs/auth';
import { getServerSession } from 'next-auth';

const Profile = async () => {
  // Получение данных о сессии в серверном компоненте. Хелпер из 'next-auth'.
  // getServerSession принимает тот же конфиг который мы формировали из провайдеров и передавали в route hendler.
  const session = await getServerSession(authConfig);

  console.log(session);

  return (
    <div>
      <h1>
        Profile of {session?.user?.name}
      </h1>
      {session?.user?.image && <img src={session?.user?.image} alt='sds'/>}
    </div>
  );
}

export default Profile;