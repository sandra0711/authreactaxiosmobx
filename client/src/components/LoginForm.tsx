import React, { FC, useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
// import userReducer from '../store/slices/userSlice';
import { fetchLogin, fetchRegister } from '../store/slices/userSlice';

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  // const store = useAppSelector(state => state.user);

  return (
    <div>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={() => dispatch(fetchLogin({ email, password }))} > Login</button>
      <button onClick={() => dispatch(fetchRegister({ email, password }))}>Регистрация</button>
    </div>
  );
};

export default LoginForm;
