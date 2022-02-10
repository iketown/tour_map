interface User {
  email: string;
  firstName: string;
  lastName: string;
  user_id: string;
}

interface AdminUser extends User {}
