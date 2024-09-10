'use client';

import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoTicketOutline } from "react-icons/io5";

import { logout } from "@/actions";
import { useUIStore } from "@/store";

export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeMenu = useUIStore(state => state.closeSideMenu);

    const { data: session } = useSession();
    const isAuthenticated = !!session?.user;
    const isAdmin = (session?.user.role === 'admin');

    return (
        <div>

            {/* Background black  */}
            {
                isSideMenuOpen && (
                    <div
                        className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"
                    />
                )
            }

            {/* Blur */}
            {
                isSideMenuOpen && (
                    <div
                        onClick={closeMenu}
                        className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
                    />
                )
            }

            {/* SideBar */}
            <nav
                className={
                    clsx(
                        "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                        {
                            'translate-x-full': !isSideMenuOpen
                        }
                    )
                }
            >
                <IoCloseOutline
                    size={40}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={closeMenu}
                />

                {/* Input search */}
                <div className="relative mt-14">
                    <IoSearchOutline size={20} className="absolute top-2 left-2" />
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
                {
                    isAuthenticated && (
                        <>
                            <Link
                                href={'/profile'}
                                onClick={closeMenu}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoPersonOutline size={25} />
                                <span className="ml-3 text-lg">Perfil</span>
                            </Link>

                            <Link
                                href={'/orders'}
                                onClick={closeMenu}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoTicketOutline size={25} />
                                <span className="ml-3 text-lg">Ordenes</span>
                            </Link>
                        </>
                    )
                }
                {/* Menu */}

                {isAuthenticated && (
                    <button
                        className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        onClick={() => logout()}
                    >
                        <IoLogOutOutline size={30} />
                        <span className="ml-3 text-xl">Salir</span>
                    </button>
                )}

                {!isAuthenticated && (
                    <Link
                        href="/auth/login"
                        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        onClick={() => closeMenu()}
                    >
                        <IoLogInOutline size={30} />
                        <span className="ml-3 text-xl">Ingresar</span>
                    </Link>
                )}
                {
                    isAdmin && (
                        <>

                            {/* Line separator */}
                            < div className="w-full h-px bg-gray-200 my-10" />

                            <Link
                                href={'/admin/products'}
                                onClick={closeMenu}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoSearchOutline size={25} />
                                <span className="ml-3 text-lg">Productos</span>
                            </Link>

                            <Link
                                href={'/admin/orders'}
                                onClick={closeMenu}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoTicketOutline size={25} />
                                <span className="ml-3 text-lg">Ordenes</span>
                            </Link>

                            <Link
                                href={'/admin/users'}
                                onClick={closeMenu}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoPeopleOutline size={25} />
                                <span className="ml-3 text-lg">Usuarios</span>
                            </Link>
                        </>
                    )
                }
            </nav>
        </div>
    )
}
