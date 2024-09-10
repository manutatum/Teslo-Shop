'use client'

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react"

export const OrderSummary = () => {

    const [loaded, setLoaded] = useState(false);
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInfo())

    useEffect(() => {
        setLoaded(true);
    }, [])

    if (!loaded) return <div className="w-full h-full bg-gray-200 animate-pulse">&nbsp;</div>

    return (
        <div className="grid grid-cols-2">
            <span>No. Productos</span>
            <span className="text-right">{itemsInCart === 1 ? '1 articulo' : `${itemsInCart} articulos`}</span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>

            <span>Impuestos (15%) </span>
            <span className="text-right">{currencyFormat(tax)}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
        </div>
    )
}
