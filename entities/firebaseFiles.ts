import {
  UploadMetadata,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

type saveFirebaseImageParams = {
  file: File;
  path: string;
  customMetadata: UploadMetadata['customMetadata'];
  progressCallback?: (value: number) => void;
};
export const saveFirebaseImage = async ({
  file,
  path,
  customMetadata,
  progressCallback,
}: saveFirebaseImageParams) => {
  const fileRef = ref(getStorage(), `images/${path}`);
  const uploadTask = uploadBytesResumable(fileRef, file, { customMetadata });

  if (progressCallback) {
    uploadTask.on('state_changed', ({ bytesTransferred, totalBytes }) => {
      const fraction = bytesTransferred / totalBytes;
      const percent = Math.round(fraction * 100);
      progressCallback(percent);
    });
  }

  return getDownloadURL((await uploadTask).ref);
};

export const generateUserCollectionImageRef = (
  userId: string,
  collectionId: string,
  includeImagePrefix: boolean = false,
) =>
  `${
    includeImagePrefix ? 'images/' : ''
  }${userId}/collections/${collectionId}/`;

export const generateUserItemImageRef = (
  userId: string,
  itemId: string,
  includeImagePrefix: boolean = false,
) => `${includeImagePrefix ? 'images/' : ''}${userId}/items/${itemId}/`;

export type saveFirebaseCollectionImageParams = {
  file: File;
  userId: string;
  collectionId: string;
  progressCallback?: (value: number) => void;
};
export const saveFirebaseCollectionImage = async ({
  file,
  userId,
  collectionId,
  progressCallback,
}: saveFirebaseCollectionImageParams) => {
  return await saveFirebaseImage({
    file,
    path: generateUserCollectionImageRef(userId, collectionId) + file.name,
    customMetadata: undefined,
    progressCallback,
  });
};

export type saveFirebaseItemImageParams = {
  file: File;
  userId: string;
  itemId: string;
  progressCallback?: (value: number) => void;
};
export const saveFirebaseItemImage = async ({
  file,
  userId,
  itemId,
  progressCallback,
}: saveFirebaseItemImageParams) => {
  return await saveFirebaseImage({
    file,
    path: generateUserItemImageRef(userId, itemId) + file.name,
    customMetadata: undefined,
    progressCallback,
  });
};
