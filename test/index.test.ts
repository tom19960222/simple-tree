import { Node, Tree } from '../lib';

interface Data {
  name: string;
}

test('Should initial a node with data', () => {
  const data = { id: 1, data: { name: 'test' } };
  const node = new Node<number, Data>(data);

  expect(node.id).toBe(data.id);
  expect(node.data).toBe(data.data);
});

test('Should initial a tree with root node provided', () => {
  const data = { id: 1, data: { name: 'test' } };
  const rootNode = new Node<number, Data>(data);
  const tree = new Tree<number, Data>(rootNode);

  expect(tree.rootNodes).toEqual([rootNode]);
});

test('Should add node to tree under root node', () => {
  const rootNode = new Node<number, Data>({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node<number, Data>({ id: 2, data: { name: 'test2' } });

  const tree = new Tree(rootNode);
  tree.addNode(1, subNode1);

  expect(rootNode.childNodes.find((node) => node.id === subNode1.id)).toBe(
    subNode1
  );
});

test('Should add a node under specific node', () => {
  const rootNode = new Node<number, Data>({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node<number, Data>({ id: 2, data: { name: 'test2' } });
  const subNode2 = new Node<number, Data>({ id: 3, data: { name: 'test3' } });
  const subSubNode1 = new Node<number, Data>({
    id: 4,
    data: { name: 'test4' },
  });
  const subSubSubNode1 = new Node<number, Data>({
    id: 5,
    data: { name: 'test5' },
  });
  const subSubSubNode2 = new Node<number, Data>({
    id: 6,
    data: { name: 'test5' },
  });

  const tree = new Tree(rootNode);
  tree.addNode(1, subNode1);
  tree.addNode(1, subNode2);
  tree.addNode(2, subSubNode1);
  tree.addNode(4, subSubSubNode1);
  tree.addNode(4, subSubSubNode2);

  expect(subSubNode1.childNodes.find((node) => node.id === 5)).toBe(
    subSubSubNode1
  );
  expect(subSubNode1.childNodes.find((node) => node.id === 6)).toBe(
    subSubSubNode2
  );
  expect(subSubNode1.parentNodeId).toBe(2);
});

test('Should return all its children of a node', () => {
  const rootNode = new Node<number, Data>({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node<number, Data>({ id: 2, data: { name: 'test2' } });
  const subNode2 = new Node<number, Data>({ id: 3, data: { name: 'test3' } });
  const subSubNode1 = new Node<number, Data>({
    id: 4,
    data: { name: 'test4' },
  });
  const subSubSubNode1 = new Node<number, Data>({
    id: 5,
    data: { name: 'test5' },
  });
  const subSubSubNode2 = new Node<number, Data>({
    id: 6,
    data: { name: 'test5' },
  });

  const tree = new Tree<number, Data>(rootNode);
  tree.addNode(1, subNode1);
  tree.addNode(1, subNode2);
  tree.addNode(2, subSubNode1);
  tree.addNode(4, subSubSubNode1);
  tree.addNode(4, subSubSubNode2);

  const childNodesOfSubNode1 = tree.getAllChildNodes(2);
  expect(childNodesOfSubNode1).toContainEqual(subNode1);
  expect(childNodesOfSubNode1).toContainEqual(subSubNode1);
  expect(childNodesOfSubNode1).toContainEqual(subSubSubNode1);
  expect(childNodesOfSubNode1).toContainEqual(subSubSubNode2);
  expect(childNodesOfSubNode1).toHaveLength(4);
});

test('Should return all its parents of a node', () => {
  const rootNode = new Node<number, Data>({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node<number, Data>({ id: 2, data: { name: 'test2' } });
  const subNode2 = new Node<number, Data>({ id: 3, data: { name: 'test3' } });
  const subSubNode1 = new Node<number, Data>({
    id: 4,
    data: { name: 'test4' },
  });
  const subSubSubNode1 = new Node<number, Data>({
    id: 5,
    data: { name: 'test5' },
  });
  const subSubSubNode2 = new Node<number, Data>({
    id: 6,
    data: { name: 'test5' },
  });

  const tree = new Tree<number, Data>(rootNode);
  tree.addNode(1, subNode1);
  tree.addNode(1, subNode2);
  tree.addNode(2, subSubNode1);
  tree.addNode(4, subSubSubNode1);
  tree.addNode(4, subSubSubNode2);

  const parentNodesOfSubNode1 = tree.getAllParentNodes(5);
  expect(parentNodesOfSubNode1).toContainEqual(subSubSubNode1);
  expect(parentNodesOfSubNode1).toContainEqual(subSubNode1);
  expect(parentNodesOfSubNode1).toContainEqual(subNode1);
  expect(parentNodesOfSubNode1).toContainEqual(rootNode);
  expect(parentNodesOfSubNode1).toHaveLength(4);
});

test('Can insert all data to root node before relationship is known', () => {
  const rootNode = new Node<number, Data>({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node<number, Data>({ id: 2, data: { name: 'test2' } });
  const subSubSubNode1 = new Node<number, Data>({
    id: 5,
    data: { name: 'test5' },
  });
  const subSubSubNode2 = new Node<number, Data>({
    id: 6,
    data: { name: 'test5' },
  });

  const tree = new Tree<number, Data>();
  tree.addNode(null, rootNode);
  tree.addNode(null, subNode1);
  tree.addNode(null, subSubSubNode1);
  tree.addNode(null, subSubSubNode2);

  tree.attachNode(2, 1);
  tree.attachNode(5, 2);
  tree.attachNode(6, 2);

  expect(tree.rootNodes).toEqual([rootNode]);
  expect(rootNode.childNodes).toEqual([subNode1]);
  expect(subNode1.childNodes).toContainEqual(subSubSubNode1);
  expect(subNode1.childNodes).toContainEqual(subSubSubNode2);
  expect(subNode1.childNodes).toHaveLength(2);

  expect(rootNode.parentNodeId).toBe(null);
  expect(subNode1.parentNodeId).toBe(1);
  expect(subSubSubNode1.parentNodeId).toBe(2);
  expect(subSubSubNode2.parentNodeId).toBe(2);
});

test('Can get all replation between nodes', () => {
  const tree = new Tree<number, Data>();

  const rootNode = new Node<number, Data>({ id: 0, data: { name: 'test' } });

  const subNode1 = new Node<number, Data>({ id: 1, data: { name: 'test1' } });
  const subNode2 = new Node<number, Data>({ id: 2, data: { name: 'test2' } });

  const subNode11 = new Node<number, Data>({
    id: 11,
    data: { name: 'test11' },
  });
  const subNode12 = new Node<number, Data>({
    id: 12,
    data: { name: 'test12' },
  });
  const subNode21 = new Node<number, Data>({
    id: 21,
    data: { name: 'test21' },
  });
  const subNode22 = new Node<number, Data>({
    id: 22,
    data: { name: 'test22' },
  });

  const subNode111 = new Node<number, Data>({
    id: 111,
    data: { name: 'test111' },
  });

  tree.addNode(null, rootNode);
  tree.addNode(rootNode.id, subNode1);
  tree.addNode(rootNode.id, subNode2);
  tree.addNode(subNode1.id, subNode11);
  tree.addNode(subNode1.id, subNode12);
  tree.addNode(subNode2.id, subNode21);
  tree.addNode(subNode2.id, subNode22);
  tree.addNode(subNode11.id, subNode111);

  expect(tree.getRelationList()).toEqual([
    { parentId: null, childId: 0 },
    { parentId: 0, childId: 1 },
    { parentId: 0, childId: 2 },
    { parentId: 1, childId: 11 },
    { parentId: 1, childId: 12 },
    { parentId: 2, childId: 21 },
    { parentId: 2, childId: 22 },
    { parentId: 11, childId: 111 },
  ]);
});
