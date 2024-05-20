import Link from 'next/link';

type AnimatedLinkProps = {
	text: string;
	href?: string;
	className?: string;
	color?: string;
};

const AnimatedLink: React.FC<AnimatedLinkProps> = ({
	text,
	className,
	href = '#',
	color = 'slate-800',
}: AnimatedLinkProps) => {
	const linkColor: string = `text-${color}`;
	const underlineColor: string = `bg-${color}`;
	return (
		<Link
			href={href}
			className={`${className} group w-fit inline-flex flex-col`}>
			<span className={linkColor}>{text}</span>
			<span
				className={`transition-all duration-300 h-0.5 ${underlineColor} max-w-0 group-hover:max-w-full block`}></span>
		</Link>
	);
};

export default AnimatedLink;
