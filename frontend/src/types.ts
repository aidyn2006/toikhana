export interface City {
  id: number;
  nameKk: string;
  nameRu: string;
  slug: string;
  toikhanaCount: number;
}

export interface Photo {
  id: number;
  url: string;
  main: boolean;
  sortOrder?: number;
}

export interface ToyType {
  id: number;
  nameKk: string;
  nameRu: string;
  slug: string;
  icon?: string;
}

export interface ToikhanaCard {
  id: number;
  name: string;
  slug: string;
  cityName: string;
  address: string;
  capacityMin?: number;
  capacityMax?: number;
  priceMin?: number;
  priceMax?: number;
  featured: boolean;
  mainPhotoUrl?: string;
  toyTypes: ToyType[];
}

export interface Toikhana extends ToikhanaCard {
  citySlug: string;
  descriptionKk?: string;
  descriptionRu?: string;
  phone?: string;
  whatsapp?: string;
  active: boolean;
  photos: Photo[];
}

export interface Booking {
  id?: number;
  toikhanaId: number;
  toikhanaName?: string;
  name: string;
  phone: string;
  eventDate: string;
  guestsCount: number;
  message?: string;
  status?: string;
}
