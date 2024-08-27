export interface Address {
  country: string;
  address: string;
  city: string;
  state?: string; // Optional field
  phone: string;
  zip?: string; // Optional field
  apt?: string; // Optional field
  dob: Date;
  imageUrl?: string;
}
