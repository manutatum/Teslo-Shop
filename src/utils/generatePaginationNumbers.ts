export const generatePagination = (currentPage: number, totalPages: number) => {
    //Si el numero total es 7 o menos mostramos todas las paginas
    //sin ...
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (x, i) => i + 1);
    }

    //Si la pagina actual esta entre las 3 primeras
    //mostramos las 3, ... y las 2 ultimas
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }
    //Si la pagina actual esta entre las 3 ultimas
    //mostramos las 2 primeras, ... y las 3 ultimas
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 2, totalPages];
    }

    //Si esta en medio
    //mostramos la primera pagina, ... actual y vecinos
    return [
        1,
        '...',
        currentPage-1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ];
}