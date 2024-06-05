export const animatedList = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			when: 'beforeChildren',
			staggerChildren: 0.1,
		},
	},
};

export const animatedItem = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

export const animatedCartList = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			when: 'beforeChildren',
			staggerChildren: 0.1,
		},
	},
};

export const animatedCartItem = {
	hidden: { opacity: 0, x: 20 },
	visible: { opacity: 1, x: 0 },
};
