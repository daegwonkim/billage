export interface Product {
  id: number;
  image: string;
  title: string;
  location: string;
  time?: string;
  priceDay: string;
  priceWeek: string;
  likes: number;
  comments?: number;
  views: number;
  rentals: number;
}

export interface Category {
  icon: string;
  label: string;
}

export type NavTab = 'home' | 'category' | 'add' | 'chat' | 'my';