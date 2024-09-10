'use server';

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary'
import { revalidatePath } from 'next/cache';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: number, imageUrl: string) => {

    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            message: 'No se puede borrar imagenes de FS'
        }
    }

    const imageName = imageUrl.split('/').at(-1)?.split('.')[0] ?? '';

    try {

        await cloudinary.uploader.destroy(imageName);

        const deletedImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            select: {
                product:{
                    select:{
                        slug: true
                    }
                }
            }
        });

        //Revalidar los paths
        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${deletedImage.product.slug}`);
        revalidatePath(`/product/${deletedImage.product.slug}`);

    } catch (error) {
        return {
            ok:false,
            message:'No se pudo eliminar la imagen'
        }
    }

    console.log({ imageName });

}