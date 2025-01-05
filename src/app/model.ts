export class User {
    firstName: string;
    lastName: string;
    loginMethod: string;
    emailId: string;
    password: string;
  
    constructor(
      firstName: string = '',
      lastName: string = '',
      loginMethod: string = '',
      emailId: string = '',
      password: string = ''
    ) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.loginMethod = loginMethod;
      this.emailId = emailId;
      this.password = password;
    }
}
export class Login {
    
    emailId: string;
    password: string;
  
    constructor(
      emailId: string = '',
      password: string = ''
    ) {
      this.emailId = emailId;
      this.password = password;
    }
}
export interface TestCase {
  id: number;
  name: string;
  isLoading: boolean;
}