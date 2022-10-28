import { IUserDocument } from '../../entities/user';

export const userExperiencePreferences: {
  key: keyof IUserDocument['experience'];
  primary: string;
  secondary?: string;
}[] = [
  {
    key: 'preferTables',
    primary: 'Prefer table view',
    secondary: 'Show lists as tables when possible',
  },
  {
    key: 'hideWishListOwned',
    primary: 'Hide owned wish list items by default',
    secondary:
      'Default to hiding wish items that I already own on my wish list',
  },
];
