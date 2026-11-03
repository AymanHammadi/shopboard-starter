// Shared catalog, persisted cart entry, and display summary types.
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export interface CartItem {
  id: Product["id"];
  quantity: number;
}

export interface CartLine extends CartItem {
  name: string;
  unitCents: number;
  lineCents: number;
}

export interface Cart {
  items: CartLine[];
  count: number;
  totalCents: number;
  storageMessage: string;
}
