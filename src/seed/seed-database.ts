import { initialData } from "./seed";
import prisma from '../lib/prisma'
import { countries } from './seed-countries';

async function main() {

    //1. Borramos los registros previos
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();
    
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const { categories, products, users } = initialData;

    await prisma.user.createMany({
        data: users
    })

    //2. Añadimos las categorias
    const categoriesData = categories.map((name) => ({
        name
    }));

    await prisma.category.createMany({
        data: categoriesData
    });

    const categoriesDB = await prisma.category.findMany();

    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id
        return map;
    }, {} as Record<string, string>)

    //3. Añadimos los productos 
    products.forEach(async (product) => {
        const { images, type, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type]
            }
        });

        //4. Añadimos los productImage

        const imagesData = images.map(img => ({
            url: img,
            productId: dbProduct.id
        }));

        await prisma.productImage.createMany({
            data: imagesData
        });
    })

    await prisma.country.createMany({
        data: countries
    });

    console.log('Seed ejecutado correctamente');
}

(() => {

    if (process.env.NODE_ENV === 'production') return;

    main();
})();