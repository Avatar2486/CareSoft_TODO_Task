export interface UserInfo {
  id: number;
  username: string;
  email?: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_id: number;
  username: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: string;
}

export interface TaskCreatePayload {
  title: string;
  description: string;
  status: string;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  status?: string;
}

export interface TaskFormValue {
  title: string;
  description: string;
  status: string;
}
