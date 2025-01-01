export type Child = {
    children: React.ReactNode;
};

export type ServerResponse = {
    data?: { [key: string]: any };
    code: number;
    message: string;
};

export type TagMaster = {
    name: string;
};

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

export type Coupon = {
    code: string;
    isActive: boolean;
    description: string;
    couponType: 'FIXED' | 'PERCENTAGE';
    rate: string;
    maxDiscountAmount: string | null;
    minOrderAmount: string | null;
    validFrom: Date;
    validUntil: Date | null;
    usageLimit: number | null;
};
