import { observer } from 'mobx-react-lite';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import UserService from './service/UserService';
import { IUser } from "./models/IUser";


const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.getUsers();
      setUsers(response.data);
      console.log(users);

    } catch (e) {

    }
  }

  if (store.isLoading) {
    return (
      <div>Загрузка...</div>
    )
  }

  if (!store.isAuth) {
    return (
      <LoginForm />
    )
  }
  return (
    <div>
      <h1>
        {store.isAuth ? `Пользователь авторизован ${store.user.email}` : "АВТОРИЗУЙТЕСЬ"}
        <button onClick={() => store.logout()}>Выйти</button>
        <button onClick={getUsers}>Получить пользователей</button>
      </h1>
    </div>
  );
};

export default observer(App);
