import { ICollection } from '../../entities/collection';
import { IItem } from '../../entities/item';

export const PLACEHOLDER_IMAGE_SRC =
  'https://via.placeholder.com/300x100?text=No+Image+Added';
export const getItemPrimaryImageUrl = (item: IItem) =>
  item.primaryImageUrl ?? PLACEHOLDER_IMAGE_SRC;
export const getCollectionCoverImageUrl = (collection: ICollection) =>
  collection.coverImageUrl ?? PLACEHOLDER_IMAGE_SRC;
