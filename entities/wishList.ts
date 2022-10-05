import { User } from 'firebase/auth';

export const WishListItemPriorities = ['low', 'medium', 'high'];
export const WishListItemStatuses = ['need', 'own'];

export interface IWishListItem {
  id: string;
  name: string;
  link: string;
  image?: string;
  priority?: 'low' | 'medium' | 'high';
  price?: string;
  description?: string;
  category?: string;
  status?: 'need' | 'own';
}

export interface IWishList {
  items: IWishListItem[];
  currency: 'us';
  userId: string;
}

export class WishListEntity implements IWishList {
  public items: IWishList['items'];
  public currency: IWishList['currency'];
  public userId: IWishList['userId'];

  constructor(user: User) {
    this.items = [];
    this.currency = 'us';
    this.userId = user.uid;
  }
}
