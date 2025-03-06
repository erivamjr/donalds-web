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
  total: number;
  toggleCart: () => void;
  addProduct: (product: CartProductProps) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProduct: (productId: string) => void;
  totalQuantity: number;
}

export const CartContext = createContext<CartContextProps>({
  isOpen: false,
  products: [],
  total: 0,
  toggleCart: () => {},
  addProduct: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProduct: () => {},
  totalQuantity: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProductProps[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const total = products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  const totalQuantity = products.reduce((total, product) => {
    return total + product.quantity;
  }, 0);
  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const addProduct = (product: CartProductProps) => {
    const productIsAlreadyOnTheCart = products.some(
      (prevProduct) => prevProduct.id === product.id,
    );
    if (!productIsAlreadyOnTheCart) {
      return setProducts((prev) => [...prev, product]);
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

  const decreaseProductQuantity = (productId: string) => {
    setProducts((prevProduct) => {
      return prevProduct.map((prevProduct) => {
        if (prevProduct.id !== productId) return prevProduct;

        if (prevProduct.quantity === 1) return prevProduct;

        return {
          ...prevProduct,
          quantity: prevProduct.quantity - 1,
        };
      });
    });
  };

  const increaseProductQuantity = (productId: string) => {
    setProducts((prevProduct) => {
      return prevProduct.map((prevProduct) => {
        if (prevProduct.id !== productId) return prevProduct;

        return {
          ...prevProduct,
          quantity: prevProduct.quantity + 1,
        };
      });
    });
  };

  const removeProduct = (productId: string) => {
    setProducts((prevProduct) => {
      return prevProduct.filter((prevProduct) => prevProduct.id !== productId);
    });
  };
  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        total,
        totalQuantity,
        toggleCart,
        addProduct,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
