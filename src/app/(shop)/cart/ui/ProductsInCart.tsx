'use client';

import Image from "next/image";

import { useCartStore } from "@/store";
import { ProductImage, QuantitySelector } from "@/components";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const ProductsInCart = () => {

    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProduct = useCartStore(state => state.removeProduct);
    const { itemsInCart } = useCartStore(state => state.getSummaryInfo())

    const [loaded, setLoaded] = useState(false);

    const productInCart = useCartStore(state => state.cart);

    useEffect(() => {
        setLoaded(true);
    }, [productInCart])


    if (!loaded) {
        return <div className="w-full h-full bg-gray-200 animate-pulse">&nbsp;</div>
    }

    if (itemsInCart === 0) {
        redirect('/empty')
    }

    return (
        <>
            {
                productInCart.map(item => (
                    <div key={`${item.slug}-${item.size}`} className="flex mb-5">
                        <ProductImage
                            src={item.image}
                            width={180}
                            height={180}
                            alt={item.title}
                            className="mr-5 rounded"
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                        />
                        <div>
                            <Link className="hover:underline cursor-pointer" href={`/product/${item.slug}`}>
                                {item.size} - {item.title}
                            </Link>
                            <p>${item.price}</p>
                            <QuantitySelector
                                quantity={item.quantity}
                                onQuantityChanged={quantity => updateProductQuantity(item, quantity)}
                            />

                            <button onClick={() => removeProduct(item)} className="underline mt-3">Remover</button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
