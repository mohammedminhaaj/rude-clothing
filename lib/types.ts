export type Child = {
	children: React.ReactNode;
};

export type IFormResponse = {
	code: number | string;
	message: string;
	payload?: any;
};

export type ServerResponse = {
	data?: { [key: string]: any };
	code: number;
	message?: string;
};

export interface TagMaster {
	name: string;
}

export type ProductListType = {
	id: string;
	name: string;
	price: string;
	originalPrice: string;
	onSale: boolean;
	availableQuantity: number;
	productImage: string;
};

export type SearchParamType = {
	[key: string]: string;
};

export type ProductIdProp = {
	productId: string;
};

export enum QuantityMode {
	INCREASE,
	DECREASE,
}
