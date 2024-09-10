'use server'

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async (cartProducts: ProductToOrder[], address: Address) => {

    const session = await auth();
    const userId = session?.user.id;

    //Verificacion sesion user
    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesion de usuario'
        }
    }

    //Obtener la informacion de los productos
    //Nota: recuerden que podemos llevar 2+ productos con la misma id
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: cartProducts.map(p => p.productId)
            }
        }
    })

    //Calcular la cantidad de productos
    const itemsInOrder = cartProducts.reduce((count, p) => count + p.quantity, 0);

    //Calcular los totales de tax, subtotal y total
    const { subTotal, tax, total } = cartProducts.reduce((totals, item) => {

        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId);

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;

    }, { subTotal: 0, tax: 0, total: 0 });

    //Crear la transaccion en la base de datos
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            //1. Actualizar el stock de los productos
            const updatedProductsPromises = products.map((product) => {
                //Acumular los valores
                const productQuantity = cartProducts.filter(
                    p => p.productId === product.id
                ).reduce((total, p) => p.quantity + total, 0);

                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`);
                }

                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        }
                        //inStock: product.inStock - productQuantity // NO HACER
                    }
                })

            });

            const updatedProducts = await Promise.all(updatedProductsPromises);

            //Verificar valores negativos = no stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`);
                }
            })

            //2. Crear la orden - Encabezado - Detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    OrderItem: {
                        createMany: {
                            data: cartProducts.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            // Validar, si el price es 0, lanzar error

            //3. Crear la direccion de la orden

            const { country, ...rest } = address;

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...rest,
                    countryId: country,
                    orderId: order.id
                }
            })

            return {
                order: order,
                orderAddress: orderAddress,
                updatedProducts: updatedProducts,
            }

        });
        
        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx
        }
    } catch (error: any) {
        console.log(error);
        return {
            ok: false,
            message: error?.message
        }
    }

}