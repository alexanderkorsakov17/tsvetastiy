
export enum Category {
  TEA = 'Чай для ванн',
  HERBS = 'Травы',
  SALT = 'Соль',
  CANDLES = 'Свечи',
  COMPLEX = 'Комплексы'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  image: string;
  benefits: string[];
  usage: string;
  color: string; // for UI accents
}

export interface RelaxTip {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  id: string;
  name: string;
  fullName?: string;
  photo: string;
  city?: string;
  location?: string; // New field for region and city
  phone?: string; // New field for phone number
  birthDate?: string;
  email?: string;
  tgId: string;
  orderCount: number;
  bonusBalance: number;
  invitedBy?: string;
  createdAt: string;
  primaryAddress?: string;
  primaryProviderId?: string;
}

export interface BonusTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'referral' | 'manual';
  amount: number;
  description: string;
  date: string;
}
