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

export interface TagData {
	name: string;
	tag_master_id: TagMaster;
}

export type ProductListType = {
	id: string;
	name: string;
	price: number;
	original_price: number;
	available_quantity: number;
	product_image: { image_path: string }[];
	on_sale: boolean;
};

export type SearchParamType = {
	[key: string]: string;
};
