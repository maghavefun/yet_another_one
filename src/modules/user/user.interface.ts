export interface UserWithUserPassword {
  id: string;
  email: string;
  username: string;
  password_hash: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserPassword {
  id: string;
  user_id: string;
  password_hash: string;
}
