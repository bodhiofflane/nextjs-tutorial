## Старт

По умолчанию Next работает с Webpack.
Для того что бы включить бету Turbopack нужно изменить скрипт:

```json
{
  "dev": "next dev --turbo"
}
```

### 0) Введение.

Как минимум 1 лейаут должен лежать в корне и это так называемый `RootLayout`.
Next не добавляем `html` и `body` во все файлы автоматически, поэтому нужно задать структуру вручную. Здесь может быть `head`, так же мы планируем добавить сюда компоненты `Header` и `Footer`.

Важно понимать, что любой `layout` принимает чилдренов и пробрасывает их в определенное пространство, указанное в шаблоне.
Смотреть файл `app/layout.tsx`.

##### Вопрос:
При запросе на страницу `'/'` с сервера возвращается уже сгенерированный `html`. Но что происходит при переходе на `'/about'`?

Мы же не получаем новый `html`.

### 1) Роутинг:
Для того что бы появился `endpoint`, достаточно в папке `app` создать папку c названием страицы, а в ней файл `page.tsx` с импортом по умолчанию.

Для создания динамических путей, нужно создать папку именованную `[slug]`, где `slug` это именование динамического параметра. Типа `id`.
Внутри папки `[id]`, также нужно создать файл `page.tsx`. Через пропс `params.[slug]` мы можем получить данные из строки запроса:

Зашли на `blog/1f123` > Получили `props.params.id` > `1f123`.

#### Вложенные роуты:
Делаются также: `blog/[slug]/edit`. Вложенность может быть любой и параметр получается также: `props.params.[slug]`.

#### Заключение:
Если нужен путь - создаём папку. Компонент который будет возвращать путь именум `page.tsx`.
Вложенный роут получается путём создания в уже существующем роуте новой папки с названием вложеного пути и файлом `page.tsx` внутри.
Для динамических путей, где можно перехватить параметр запроса, используется папка с названием `[slug]` и также файл `page.tsx`.
Доступ к параметру запроса получается `через props.params.[slug]`. (Пропс нужно типизировать вручную...)


### 2) Дополнительные лейауты:
Без обязательного корневого `layout` работаь приложение небудет, но можно создать дополнительные.

Layout в путях именуются `layout.tsx` и экспортируют по дефолту например: `export default const AboutLayout = () => {}`.
По сути, это обычная обёртка для каждого `page.tsx` в конкретном пути и использовать её особого смысла нет.


### 3) Метаданные:
Могут быть на любой странице. Но почему то экспорт `metadata` из `about/page.tsx`, работает только для соответствующего пути. Т.е. вложенные пути не накрываются. Да ну и ладно. Вот пример:
```javascript
export const metadata: Metadata = {
  title: "Blog | Next App",
  description: "Generated by create next app",
};
```
1) Экспортируем объект с зарезервированным именем `metadata`.
2) Сигнатуру типов достаём из `'next'`.

Формирование метаданных для динамических путей выглядит подругому:
```js
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getData(params.id);
  return {
    title: post.title,
  };
}
```
1) Здесь экспортируется функция с именем `generateMetadata`.
2) Функция асинхронная и в качестве параметра может принимать параметры запроса.
3) Функия возвращает промис с сигнатурой `Metadata`.

### 4) Серверные компоненты:
Все комоненты что мы создавалии по умолчанию являются серверными. Это не `SSR` который кинул `html` с натянутым `js`. ___Бредовая строка...___

#### Плюс серверных компонентов:
+ На фроненд не поставляется лишний js. Работает и с динамическими маршрутами. (What?)

#### Минусы серверных компонентов:
- Мы не можем использовать ничего связанного со стейтом.
- Не можем использовать хуки React.js, Next.js и из любым других библиотек.
- Нельзя использовать методы жизненного цикла и соответственно классовые компоненты.

___Если все таки хотим работать со стейтом и жизненными циклами компонентов то нужно создавать клиенские компоненты.___

`'use client'` -> Делает компонент клиентским и открывает доступ к хукам, состоянию и т.д. Пригодятся но позже.

___В строке поиска нам понадобятся клиенские компоненты и они будут отрабатывать на клиенте.___


### 5) Получение данных на сервере и кеширование:
Данные в серверных компонентах получаются с помощью `fetch`.

`Fetch` в `Next.js` расширен и исполняется на сервере. Например в `option` запроса можно передать объект `next: {revalidate: 60}`, что означает что после запроса данные будут кешироваться на сервере в течении 60 секунд. (НЕ ДЛЯ КЛИЕНТА - ДЛЯ СЕРВЕРА!)

Методанные в динамических страинцах получаются путем дополнительного запроса на основе динамического параметра `params.id` и распаковкой полученного ответа. Выглядит стрёмно, так как нужно сделать два запроса для получения одной страницы.

Кстати, все `console.log()` отрабатывают на сервере. На клиент как я понял вообще не посылается `js`.

#### Дополнительно:
+ Мы изпользовали СЕРВЕРНЫЙ `fetch`, а это значит что мы можем использовать секретные ключи из переменных окружения и они не уйдут на клиент.
+ Также, из за того что `getData()` является серверной функцией - мы можем использовать в ней все что касается баз данных. 
Например подключить `ORM PRISMA` и делать запрос к базе через `getData()`.
+ Чаще работают с конкретными эндпойнтами `REST API`, но бывают случае работы с монолитами.

### 6) Файлы Loading и Error:
Это файлы с зарезервированными именами. Файл `loading.tsx` начнет рендерится в момент запроса и до момента получения данных.
При этом, более вложенный файл `loading.tsx` перекривает верхние файлы `loading.tsx`.

Файл `error.tsx `должен быть клиентским модулем, но при этом также возвращать компонент по дефолту.
Доступ к вырбошенной ошибке происходит через `props.error`. (Нужно типизировать `Error`)

## Использование клиентских компонентов

### 1) Серверные vs клиентские компоненты:

Серверные компоненты это новинка в `React 18`. Их активно используют пока что только в `Next.js`.

Серверные и клиентские компоненты могут быть вложены друг в друга, но по определенным правилам.

___Серверный компонент___ - основную базовую логику, `React` выполняет только на сервере, а на клиент поставляется результат рендеринга, что сильно снижает размер бандла.

Тяжелые библиотеки не попадают в бандл, так как они исполняются на сервере, что повышает безопасность, потому как секретные данные не уйдут. Вообщем плюсов обещают много.

(Хз как это понимать. Отправляется только `html`?)

___Клиентские компоненты___ - классические `React`-компоненты.

#### Правила сочитания серверных и клиентских компонентов:
1) Внутрь ___клиентского___ компонента нельзя импортировать ___серверный___ для дальнейшего использования.
2) Можно пробрасывать ___серверные___ комоненты в ___клиентские___ как `children`. Ну или пробрасывать через любые пропсы...

! Основые компоненты ___серверные___, и в них точечно используются ___клиентские___.


#### Рекомендованные подходы использования компонентов:

Использовать клиентские компоненты когда:
+ Необходимо использовать хуки.
+ Когда необходмы обработчики событий на пользовательские действия.
+ При использовании браузерного API. (local storage, observers)
+ Когда используются классовые компоненты. (error boundary для клиентского компонента)

Использовать серверные компоненты когда:
+ Получаем данные через серверное API.
+ Когда нужен прямой доступ к ресурсам бэкенда. (DB)
+ Когда используется sensetive информация. (ключи API, токены и пр.)
+ Когда используются тяжелые зависимости. (Чтобы не попадало в отправляемый bundle)


### 2) Использование UI-библиотек:
UI-библиотеки типа MUI или Chakra, могут использоваться только с `'use client'` из за того что используют с событиями.

! Клиенский компонент вложенный в другой клиенский компонент можно не помечать `'use client'`. (фигня... Лучшей практикой будет писать директиву везде)

! Кстати мы можем создать компонент провайдеров связанных с клиентом, инициализировать в нем все нужные провайдеры и обернуть им корневой `layout`. (Так сказал автор...)

### 3) Активные табы навигации:

