export type QuickLink = {
    image: string;
    title: string;
    forwardLink: string;
};

export type SliderItem = {
    image: string;
    title: string;
    forwardLink: string;
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
    title: string;
    img: string;
    label?: string;
    paymentNote?: string;
    oldPrice?: string;
    discountedPrice: string;
    cartPrice?: string;
    rating: number;
    votes: number;
    extra?: string;
}