export class SearchUserDto {
  fullName?: string;
  email?: string;
  limit?: number;
  take?: number;
  views?: 'DESC' | 'ASC';
  body?: string;
  title?: string;
  tag?: string;
}
