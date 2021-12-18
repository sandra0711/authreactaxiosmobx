import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponce";

export default class AuthService {
  static async login(email: any, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/user/login', { email, password })
  };

  static async register(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/user/register', { email, password })
  };

  static async logout(): Promise<void> {
    return $api.post('/user/logout')
  };
}

