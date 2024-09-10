'use client'

import { QuantitySelector, SizeSelector } from '@/components'
import { Product } from '@/interfaces'
import { useState } from 'react';
import { CartProduct, Size } from '../../../../../interfaces/product.interface';
import { useCartStore } from '@/store';

interface Props {
    product: Product;
}

export const AddToCart = ({ product }: Props) => {

    const [size, setSize] = useState<Size | undefined>()
    const [quantity, setQuantity] = useState<number>(1);
    const [posted, setPosted] = useState(false);

    const addProductToCart = useCartStore(state => state.addProcutToCart);

    const addToCart = () => {
        setPosted(true);

        if (!size) return;

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images[0]
        }

        addProductToCart(cartProduct);

        setPosted(false);
        setQuantity(1);
        setSize(undefined);
    }

    return (
        <>
            {
                posted && !size && (
                    <span className='mt-2 text-red-5product.title0'>
                        Debe de seleccionar una talla*
                    </span>
                )
            }
            {/* Selector de Tallas */}
            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSizeChanged={setSize}
            />
            {/* Selector de Cantidad */}
            <QuantitySelector
                quantity={quantity}
                onQuantityChanged={setQuantity}
            />
            {/* Button */}
            <button
                onClick={addToCart}
                className="btn-primary my-5">
                Agregar al carrito
            </button>
        </>
    )
}
