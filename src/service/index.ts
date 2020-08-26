import request from 'umi-request';

interface User {
  id: string;
  username: string;
}

interface UserListItem {
  id: string;
  name: string;
  gender: 'male' | 'female';
  email: string;
  disabled: boolean;
}

export function init(): void {}
