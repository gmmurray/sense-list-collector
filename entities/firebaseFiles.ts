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

type saveFirebaseCollectionImageParams = {
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
    path: `${userId}/collections/${collectionId}/${file.name}`,
    customMetadata: undefined,
    progressCallback,
  });
};
