# Teslo Shop

**Teslo Shop** es una tienda de ropa inspirada en la experiencia de compra de la tienda oficial de Tesla. Este proyecto simula una plataforma de comercio electrónico donde los usuarios pueden explorar y adquirir productos de moda de alta calidad. La aplicación está diseñada para ofrecer una experiencia de usuario moderna, fluida y minimalista, similar a las interfaces premium de Tesla.

## Características:
- Catálogo de productos organizado por categorías
- Integración con métodos de pago populares
- Carrito de compras interactivo y sistema de gestión de pedidos

## Tecnologías:
- **Frontend:** Next.js
- **Backend:** Prisma, NextAuth
- **Base de datos:** Postgres
- **Deploy:** Vercel

## Correr en dev

1. Clonar el repositorio
2. Crear una copia del ```.env.template``` y renombrarlo a ```.env``` y cambiar las variable de entorno
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de prisma ```npx prisma migrate dev```
6. Ejecutamos el seed ```npm run seed```
7. Correr el proyecto ```npm run dev```

## Correr en prod
