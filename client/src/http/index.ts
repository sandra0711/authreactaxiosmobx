import axios from 'axios';

const API_URL = 'http://localhost:5000';

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
});


// $api.interceptors.request.use(function (config) {
//   // Do something before request is sent
//   config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
//   return config;
// });

export default $api;
