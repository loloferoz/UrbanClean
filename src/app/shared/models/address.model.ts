export interface Address {
  id: string;
  country: string;
  community: string;
  city: string;
  street: string;
  number: number;
  zipCode: string;
}

export const defaultAddress = {
  id: '',
  country: '',
  community: '',
  city: '',
  street: '',
  number: 0,
  zipCode: '',
};
