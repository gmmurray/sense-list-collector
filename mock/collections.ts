import { ICollectionWithId } from '../entities/collection';

const collectionsJSON = [
  {
    id: 'f1f4db42-39b6-4d80-a074-a65fcdc3a7d0',
    name: 'Murphy, Feeney and Sporer',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.',
    isPublic: false,
    coverImageUrl: 'http://dummyimage.com/207x100.png/dddddd/000000',
    createdAt: '1611945326000',
    updatedAt: '1656085860000',
  },
  {
    id: '0f1cdd5d-7990-49ad-86bc-5841ad9d0657',
    name: 'McGlynn-Bogan',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
    isPublic: true,
    coverImageUrl: 'http://dummyimage.com/113x100.png/5fa2dd/ffffff',
    createdAt: '1624108920000',
    updatedAt: '1655637319000',
  },
  {
    id: '038233aa-c8ef-4f63-a610-cb79943e3a66',
    name: 'Langosh-Wisozk',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
    isPublic: false,
    coverImageUrl: 'http://dummyimage.com/135x100.png/dddddd/000000',
    createdAt: '1629497993000',
    updatedAt: '1648509875000',
  },
  {
    id: '5ff80621-fe29-436f-918d-8e7bf7c4578c',
    name: 'Walker, Metz and Hills',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n\nProin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
    isPublic: false,
    coverImageUrl: 'http://dummyimage.com/166x100.png/ff4444/ffffff',
    createdAt: '1617863229000',
    updatedAt: '1654462667000',
  },
  {
    id: 'efc20ecd-5867-4599-9ece-57249473c20f',
    name: 'Keebler Inc',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.',
    isPublic: false,
    coverImageUrl: 'http://dummyimage.com/207x100.png/5fa2dd/ffffff',
    createdAt: '1625868698000',
    updatedAt: '1647087013000',
  },
  {
    id: '8f8fedbf-9c59-4554-9414-e17d9e3f20f7',
    name: 'Fadel, Hoeger and Herman',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.',
    isPublic: true,
    coverImageUrl: 'http://dummyimage.com/235x100.png/cc0000/ffffff',
    createdAt: '1632550110000',
    updatedAt: '1645335206000',
  },
  {
    id: '0f041630-78b7-4d02-bed3-981737b667c9',
    name: 'Konopelski-Kris',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    isPublic: true,
    coverImageUrl:
      'https://static.wikia.nocookie.net/gundam/images/8/8e/Rx-93-v-2.jpg',
    createdAt: '1630457674000',
    updatedAt: '1657747340000',
    itemIds: [
      '3ce7b82c-306c-4dc5-9016-3391379b2efc',
      '251a9a27-a85e-4bf1-abe2-93a989393b6b',
      '44433637-9d50-4ac9-9a97-922f1d72a1fe',
      '95f8a6d1-8a74-4f01-a49a-ad457cacab9d',
      '820b9d42-117e-4f29-b7c2-7e8bfa348651',
    ],
    favoriteItemIds: [
      '44433637-9d50-4ac9-9a97-922f1d72a1fe',
      '95f8a6d1-8a74-4f01-a49a-ad457cacab9d',
      '820b9d42-117e-4f29-b7c2-7e8bfa348651',
    ],
  },
  {
    id: 'bec7c3b1-beae-4085-a839-c030596fa6e3',
    name: 'Rempel Inc',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.\n\nVestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.',
    isPublic: false,
    coverImageUrl:
      'https://thumbs.dreamstime.com/b/sun-rays-mountain-landscape-5721010.jpg',
    createdAt: '1628581825000',
    updatedAt: '1658431221000',
  },
  {
    id: '7a8842e1-4693-4807-abce-f5fc5676fbd0',
    name: 'Ritchie Inc',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',
    isPublic: false,
    coverImageUrl: 'http://dummyimage.com/166x100.png/dddddd/000000',
    createdAt: '1636871799000',
    updatedAt: '1642904355000',
  },
  {
    id: '2961909c-1422-45bb-bc4c-d18a72467250',
    name: 'Kirlin Inc',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.',
    isPublic: false,
    coverImageUrl: 'http://dummyimage.com/226x100.png/ff4444/ffffff',
    createdAt: '1636910367000',
    updatedAt: '1656771640000',
  },
  {
    id: '46ab2c60-f5e1-4778-80b9-88ff50b277c4',
    name: 'Cronin LLC',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
    isPublic: false,
    coverImageUrl: 'http://dummyimage.com/224x100.png/cc0000/ffffff',
    createdAt: '1615898076000',
    updatedAt: '1646523345000',
  },
  {
    id: '161bb6d4-cde4-4249-8ec8-fc63c488c76f',
    name: 'Casper and Sons',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.',
    isPublic: false,
    coverImageUrl: 'http://dummyimage.com/123x100.png/cc0000/ffffff',
    createdAt: '1638182011000',
    updatedAt: '1651763748000',
  },
  {
    id: '4bcc158a-7f33-42ff-9dbc-1c4b44802caf',
    name: 'Raynor, Hirthe and Larson',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    isPublic: true,
    coverImageUrl: 'http://dummyimage.com/246x100.png/5fa2dd/ffffff',
    createdAt: '1615144403000',
    updatedAt: '1655735899000',
  },
  {
    id: '0e1f9c0d-dfb2-4b61-b0e5-62378fb8f2e3',
    name: 'Farrell Group',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.\n\nPhasellus in felis. Donec semper sapien a libero. Nam dui.',
    isPublic: false,
    coverImageUrl: 'http://dummyimage.com/198x100.png/ff4444/ffffff',
    createdAt: '1618933852000',
    updatedAt: '1651350722000',
  },
  {
    id: '9d441d9b-61c1-4785-844f-a1d856f049c6',
    name: 'Lind-Runolfsson',
    userId: 'Sq8nDL1TLNQaOmv7ANjF7tnWJze2',
    description:
      'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.\n\nCras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.\n\nQuisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.',
    isPublic: true,
    coverImageUrl: 'http://dummyimage.com/168x100.png/cc0000/ffffff',
    createdAt: '1637111020000',
    updatedAt: '1651917778000',
  },
];

export const mockCollections = () =>
  collectionsJSON.map(
    c =>
      ({
        ...c,
        itemIds: c.itemIds ?? [],
        favoriteItemIds: c.favoriteItemIds ?? [],
        createdAt: new Date(parseInt(c.createdAt)),
        updatedAt: new Date(parseInt(c.updatedAt)),
      } as ICollectionWithId),
  );
