"use client";

import { Product } from "@prisma/client";
import { ReactNode, useState } from "react";
import { createContext } from "react";

interface CartProductProps extends Product {
  quantity: number;
}
export interface CartContextProps {
  isOpen: boolean;
  products: CartProductProps[];
  toggleCart: () => void;
}

export const CartContext = createContext<CartContextProps>({
  isOpen: false,
  products: [],
  toggleCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProductProps[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <CartContext.Provider value={{ isOpen, products, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};
