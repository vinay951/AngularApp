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
  loading: boolean;
}
export interface Test{
  name: string;
  loading: boolean;
}
export class ProfilePic{
  email: string;
  picture: string;
  constructor(
    email: string = '',
    picture: string = ''
  ) {
    this.email = email;
    this.picture = picture;
  }
}
// product.model.ts
export interface Product {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;   //base64 string
  rating: number;      // 0–5
  price: number;
}

// Cart entity stored in backend
export interface CartEntity {
  id: number;
  email: string;
  productId: string; // corresponds to Product.id
}

// Combined object returned by backend: cart entry plus product details.
export interface ProductAndCartEntity {
  id: number;                // cart entry id
  email?: string;
  productId?: string;        // product id when product object absent
  product?: Product;         // product details (preferred)
  // Backwards-compatible product fields may be present at the top level
  name?: string;
  brand?: string;
  imageUrl?: string;
  rating?: number;
  price?: number;
}
