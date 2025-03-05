"use client";

import { Product } from "@prisma/client";
import { ReactNode, useState } from "react";
import { createContext } from "react";

interface CartProductProps
  extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  quantity: number;
}
export interface CartContextProps {
  isOpen: boolean;
  products: CartProductProps[];
  toggleCart: () => void;
  addProduct: (product: CartProductProps) => void;
}

export const CartContext = createContext<CartContextProps>({
  isOpen: false,
  products: [],
  toggleCart: () => {},
  addProduct: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProductProps[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const addProduct = (product: CartProductProps) => {
    setProducts((prev) => [...prev, product]);
  };
  return (
    <CartContext.Provider value={{ isOpen, products, toggleCart, addProduct }}>
      {children}
    </CartContext.Provider>
  );
};
