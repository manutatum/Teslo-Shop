'use server';

import prisma from "@/lib/prisma";
import { Gender, Product, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {

    const data = Object.fromEntries(formData);

    const productParsed = productSchema.safeParse(data);

    if (!productParsed.success) {
        console.log(productParsed.error);
        return { ok: false }
    }

    const productData = productParsed.data;
    //Arreglo del slug en caso de que no este en el formato adecuado
    productData.slug = productData.slug.toLowerCase().replace(/ /g, '-').trim();

    const { id, ...rest } = productData;

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            let product: Product;
            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());

            if (id) {
                //Actualizar
                product = await tx.product.update({
                    where: { id },
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[],
                        },
                        tags: {
                            set: tagsArray,
                        },
                    }
                });
            } else {
                //Crear
                product = await tx.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[],
                        },
                        tags: {
                            set: tagsArray,
                        },
                    }
                })
            }

            //Proceso de carga y guardado de imagenes
            //Recorrerlas y guardarlas
            if (formData.getAll('images')) {
                const images = await uploadImages(formData.getAll('images') as File[]);
                if (!images) {
                    throw new Error('No se pudo cargar las imagenes')
                }

                await prisma.productImage.createMany({
                    data: images.map(img => ({
                        url: img!,
                        productId: product.id
                    }))
                });
            }

            return {
                product
            }
        });

        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${prismaTx.product.slug}`);
        revalidatePath(`/products/${prismaTx.product.slug}`);

        return {
            ok: true,
            product: prismaTx.product
        }

    } catch (error) {
        return {
            ok: false,
            message: 'Revisar los logs, no se pudo actualizar/crear'
        }
    }
}

const uploadImages = async (images: File[]) => {
    try {

        const uploadPromises = images.map(async (img) => {
            try {
                const buffer = await img.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');

                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
                    .then(r => r.secure_url);
            } catch (error) {
                console.log(error);
                return null;
            }
        });

        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages;

    } catch (error) {
        console.log(error);
        return null;
    }
}