import {
  IUserDocument,
  createUserProfile,
  createUserUsername,
  updateUserCategory,
  updateUserExperience,
  updateUserProfile,
  updateUserUsername,
} from '../../../entities/user';
import { deleteObject, getStorage, listAll, ref } from 'firebase/storage';
import {
  generateUserAvatarImageRef,
  saveFirebaseUserAvatarImage,
  saveFirebaseUserAvatarImageParams,
} from '../../../entities/firebaseFiles';

import { RequiredProps } from '../../types/typeModifiers';
import { doc } from 'firebase/firestore';
import { reactQueryClient } from '../../../config/reactQuery';
import { useMutation } from '@tanstack/react-query';
import { userQueryKeys } from './userQueries';

export const useUpdateUserCategoryMutation = () =>
  useMutation(
    ({
      category,
      isAdditive,
      userId,
    }: {
      category: string;
      isAdditive: boolean;
      userId?: string;
    }) => updateUserCategory(category, isAdditive, userId),
    {
      onSuccess: () => reactQueryClient.invalidateQueries(userQueryKeys.all),
    },
  );

export const useUpdateUserExperienceMutation = () =>
  useMutation(
    ({
      key,
      value,
      userId,
    }: {
      key: keyof IUserDocument['experience'];
      value: boolean;
      userId?: string;
    }) => updateUserExperience(key, value, userId),
    {
      onSuccess: () => reactQueryClient.invalidateQueries(userQueryKeys.all),
    },
  );

export const useCreateUserProfileMutation = () =>
  useMutation(
    async ({
      profile,
      userId,
      file,
      progressCallback,
    }: {
      profile: RequiredProps<IUserDocument>['profile'];
      userId: string;
      file?: File;
      progressCallback?: saveFirebaseUserAvatarImageParams['progressCallback'];
    }) => {
      let avatarUrl = file
        ? await saveFirebaseUserAvatarImage({ file, progressCallback, userId })
        : profile.avatar;

      await createUserProfile({ ...profile, avatar: avatarUrl }, userId);
    },
    {
      onSuccess: () => reactQueryClient.invalidateQueries(userQueryKeys.all),
    },
  );

export const useUpdateUserProfileItemMutation = () =>
  useMutation(
    ({
      key,
      value,
      userId,
    }: {
      key: keyof RequiredProps<IUserDocument>['profile'];
      value: string;
      userId?: string;
    }) => updateUserProfile(key, value, userId),
    { onSuccess: () => reactQueryClient.invalidateQueries(userQueryKeys.all) },
  );

export const useUpdateUserProfileAvatarMutation = () =>
  useMutation(
    async ({
      userId,
      file,
      progressCallback,
    }: {
      userId: string;
      file: File;
      progressCallback: saveFirebaseUserAvatarImageParams['progressCallback'];
    }) => {
      try {
        const oldImages = await listAll(
          ref(getStorage(), generateUserAvatarImageRef(userId, true)),
        );

        const newAvatarImageUrl = await saveFirebaseUserAvatarImage({
          file,
          userId,
          progressCallback,
        });

        await updateUserProfile('avatar', newAvatarImageUrl, userId);

        await Promise.all([
          ...oldImages.items.map(oldRef => deleteObject(oldRef)),
        ]);
      } catch (error) {
        console.log(error);
        throw new Error('Error updating avatar image');
      }
    },
    {
      onSuccess: () => reactQueryClient.invalidateQueries(userQueryKeys.all),
    },
  );

export const useUpdateUserUsernameMutation = () =>
  useMutation(
    ({ username, userId }: { username: string; userId: string }) =>
      updateUserUsername(username, userId),
    { onSuccess: () => reactQueryClient.invalidateQueries(userQueryKeys.all) },
  );
