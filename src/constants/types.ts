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
    // New fields for the "second card"-style
    couponText?: string;       // e.g. "7000 TL'ye 300 TL Kupon"
    buttonText?: string;       // e.g. "Sepete Ekle"
    specialBackground?: string; // optionally a color or background
}
