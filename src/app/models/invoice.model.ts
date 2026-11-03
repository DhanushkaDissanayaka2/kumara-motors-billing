export interface Customer {
  name: string;
  email: string;
  address: string;
}

export interface Product {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  date: Date;
  customer: Customer;
  products: Product[];
  subtotal: number;
  tax: number;
  total: number;
}