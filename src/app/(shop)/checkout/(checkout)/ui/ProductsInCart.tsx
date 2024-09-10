'use client';

import Image from "next/image";

import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { currencyFormat } from "@/utils";

export const ProductsInCart = () => {

    const { itemsInCart } = useCartStore(state => state.getSummaryInfo())

    const [loaded, setLoaded] = useState(false);

    const productInCart = useCartStore(state => state.cart);

    useEffect(() => {
        setLoaded(true);
    }, [productInCart])


    if (!loaded) {
        return <div className="w-full h-full bg-gray-200 animate-pulse">&nbsp;</div>
    }

    // if (itemsInCart === 0) {
    //     redirect('/empty')
    // }

    return (
        <>
            {
                productInCart.map(item => (
                    <div key={`${item.slug}-${item.size}`} className="flex mb-5">
                        <Image
                            src={`/products/${item.image}`}
                            width={100}
                            height={100}
                            alt={item.title}
                            className="mr-5 rounded"
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                        />
                        <div>
                            <span>
                                {item.size} - {item.title} ({item.quantity})
                            </span>

                            <p className="font-bold">{currencyFormat(item.price * item.quantity)}</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
