export type QuickLink = {
    topText: string;
    title: string;
    category: string;
};

export type SliderItem = {
    image: string;
    title: string;
};


export interface DealItem {
    id: number;
    title: string;
    price: string;
    rating: number;
    image: string;
    couponText?: string;
    buttonText?: string;
    specialBackground?: string;
}

export interface RecommendedItem {
    id: number;
    name: string;
    image: string;
    price: string;
    rating: number;
    reviews: number;
}
