'use client';

// Страница ошибки должна использовать use client. А значит мы можем использовать здесь методы жизненного цикла, состояния и т.д...
// Например при неудачном запросе из функция getData мы выбрасываем ошибку и эта ошибка доступа как пропс error в нашем компоненте.

const ErrorWrapper = ({error}: {error: Error}) => {
  return (
    <h1>Opps!!! {error.message}</h1>
  );
}
 
export default ErrorWrapper;