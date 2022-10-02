import withUser, { useUserContext } from '../../../lib/hoc/withUser';

import React from 'react';
import { getStringFromStringOrArray } from '../../../lib/helpers/stringHelpers';
import { useGetUserItemQuery } from '../../../lib/queries/items/itemQueries';
import { useRouter } from 'next/router';

const ViewItem = () => {
  const router = useRouter();

  const {
    query: { itemId },
  } = router;

  const { authUser } = useUserContext();

  const { data: item, isLoading: itemLoading } = useGetUserItemQuery(
    getStringFromStringOrArray(itemId),
    authUser?.uid,
  );
  return <div>ViewItem</div>;
};

export default withUser(ViewItem);
