import React, { FC } from 'react';
// import LoginForm from './components/LoginForm';
// import UserService from './service/UserService';
// import { IUser } from "./models/IUser";
import { useAppDispatch, useAppSelector } from './hooks/redux';
import LoginForm from './components/LoginForm';
import { fetchLogout } from './store/slices/userSlice';


const App: FC = () => {
  const store = useAppSelector(state => state.user);
  console.log(store);

  // const [users, setUsers] = useState<IUser[]>([]);
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   if (localStorage.getItem('token')) {
  //     // dispatch(checkAuth())
  //   }
  // }, [dispatch]);

  // async function getUsers() {
  //   try {
  //     const response = await UserService.getUsers();
  //     setUsers(response.data);
  //     console.log(users);

  //   } catch (e) {

  //   }
  // }

  // if (store.isLoading) {
  //   return (
  //     <div>Загрузка...</div>
  //   )
  // }

  // if (!store.isAuth) {
  //   return (
  //     <LoginForm />
  //   )
  // }
  return (
    <div>
      <h1>
        {store.isAuth ? `Пользователь авторизован ${store.user.email}` : "АВТОРИЗУЙТЕСЬ"}
        <LoginForm />
        <button onClick={() => dispatch(fetchLogout())}>Выйти</button>
        {/* {/* <button onClick={getUsers}>Получить пользователей</button> */}
      </h1>
    </div>
  );
};

export default App;
