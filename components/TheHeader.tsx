import Navigation from './Navigation';

// В серверном компоненте может быть запрос к базе данных для определения авторизации пользователя.
// В простейшем варианте по полученным куки и сделать запрос к бд , получив либо полный либо упрощенный набор navItems.

// Здесь хардкод, но мы можем получать данные из БД. В том чилсе и массив с navItems.
const navItems = [
  {label: 'Home', href: '/'},
  {label: 'Blog', href: '/blog'},
  {label: 'About', href: '/about'},
];

const TheHeader = () => {
  return (
    <header>
      <nav>
        {/* Это клиентский компонент. Он точечно подключается в серверный компонент и в нем используется хук usePathname */}
        <Navigation navLinks={navItems}/>
      </nav>
    </header>
  );
};

export default TheHeader;
