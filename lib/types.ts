export type Child = {
	children: React.ReactNode;
};

export interface IFormResponse {
	code: number | string;
	message: string;
	payload?: any;
}
