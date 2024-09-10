import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {
    cart: CartProduct[];

    getTotalItems: () => number;
    getSummaryInfo: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    }

    addProcutToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;

    clearCart: () => void;
}

export const useCartStore = create<State>()(

    persist(
        (set, get) => ({
            cart: [],
            getTotalItems: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + item.quantity, 0);
            },
            getSummaryInfo: () => {
                const { cart } = get();

                const subTotal = cart.reduce((subTotal, item) => (subTotal + (item.price * item.quantity)), 0);

                const tax = subTotal * 0.15;
                const total = subTotal + tax;
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

                return {
                    subTotal,
                    tax,
                    total,
                    itemsInCart
                }
            },
            addProcutToCart: (product: CartProduct) => {
                const { cart } = get();

                //1.Revisar si el producto existe en el carrito con la talla
                const productInCart = cart.some(
                    (item) => item.id === product.id && item.size === product.size
                );

                if (!productInCart) {
                    set({ cart: [...cart, product] })
                    return;
                }

                //2. El producto existe por talla hay que actualizar
                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }
                    return item;
                });

                set({
                    cart: updatedCartProducts
                })
            },
            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: quantity }
                    }
                    return item;
                });

                set({
                    cart: updatedCartProducts
                })
            },
            removeProduct: (product: CartProduct) => {
                const { cart } = get();

                const productsFilter = cart.filter(item => item.id !== product.id || item.size !== product.size);

                set({
                    cart: productsFilter
                })
            },
            clearCart: () => {
                set({ cart: [] });
            },
        })
        ,
        {
            name: 'shopping-cart',
        }
    )



)