import Image from "next/image"

interface Props {
    src?: string;
    alt: string;
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className']
    width: number;
    height: number;
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
}

export const ProductImage = ({ alt, height, width, className, src, style }: Props) => {

    const locarSrc = (src)
        ? src.startsWith('http')
            ? src
            : `/products/${src}`
        : '/imgs/placeholder.jpg';

    return (
        <Image
            src={locarSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={style}
        />
    )
}
