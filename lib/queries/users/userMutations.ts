import { reactQueryClient } from '../../../config/reactQuery';
import { updateUserCategory } from '../../../entities/user';
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
