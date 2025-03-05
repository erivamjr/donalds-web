"use client";

import { Product } from "@prisma/client";
import { ReactNode, useState } from "react";
import { createContext } from "react";

export interface CartProductProps
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
    const productIsAlreadyOnTheCart = products.some(
      (prevProduct) => prevProduct.id === product.id,
    );
    if (!productIsAlreadyOnTheCart) {
      setProducts((prev) => [...prev, product]);
    }
    setProducts((prevProduct) => {
      return prevProduct.map((prevProduct) => {
        if (prevProduct.id === product.id) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + product.quantity,
          };
        }
        return prevProduct;
      });
    });
  };
  return (
    <CartContext.Provider value={{ isOpen, products, toggleCart, addProduct }}>
      {children}
    </CartContext.Provider>
  );
};
