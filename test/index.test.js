const { Node, Tree } = require('../lib');

test('Should initial a node with data', () => {
  const data = { id: 1, data: { name: 'test' } };
  const node = new Node(data);
  expect(node.id).toBe(data.id);
  expect(node.data).toBe(data.data);
});

test('Should initial a tree with root node provided', () => {
  const data = { id: 1, data: { name: 'test' } };
  const rootNode = new Node(data);
  const tree = new Tree(rootNode);

  expect(tree.rootNodes).toEqual([rootNode]);
});

test('Should add node to tree under root node', () => {
  const rootNode = new Node({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node({ id: 2, data: { name: 'test2' } });

  const tree = new Tree(rootNode);
  tree.addNode(1, subNode1);

  expect(rootNode.childNodes.find(node => node.id === subNode1.id)).toBe(subNode1);
});

test('Should add a node under specific node', () => {
  const rootNode = new Node({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node({ id: 2, data: { name: 'test2' } });
  const subNode2 = new Node({ id: 3, data: { name: 'test3' } });
  const subSubNode1 = new Node({ id: 4, data: { name: 'test4' } });
  const subSubSubNode1 = new Node({ id: 5, data: { name: 'test5' } });
  const subSubSubNode2 = new Node({ id: 6, data: { name: 'test5' } });

  const tree = new Tree(rootNode);
  tree.addNode(1, subNode1);
  tree.addNode(1, subNode2);
  tree.addNode(2, subSubNode1);
  tree.addNode(4, subSubSubNode1);
  tree.addNode(4, subSubSubNode2);

  expect(subSubNode1.childNodes.find(node => node.id === 5)).toBe(subSubSubNode1);
  expect(subSubNode1.childNodes.find(node => node.id === 6)).toBe(subSubSubNode2);
  expect(subSubNode1.parentNodeId).toBe(2);
});

test('Should return all its children of a node', () => {
  const rootNode = new Node({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node({ id: 2, data: { name: 'test2' } });
  const subNode2 = new Node({ id: 3, data: { name: 'test3' } });
  const subSubNode1 = new Node({ id: 4, data: { name: 'test4' } });
  const subSubSubNode1 = new Node({ id: 5, data: { name: 'test5' } });
  const subSubSubNode2 = new Node({ id: 6, data: { name: 'test5' } });

  const tree = new Tree(rootNode);
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
  const rootNode = new Node({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node({ id: 2, data: { name: 'test2' } });
  const subNode2 = new Node({ id: 3, data: { name: 'test3' } });
  const subSubNode1 = new Node({ id: 4, data: { name: 'test4' } });
  const subSubSubNode1 = new Node({ id: 5, data: { name: 'test5' } });
  const subSubSubNode2 = new Node({ id: 6, data: { name: 'test5' } });

  const tree = new Tree(rootNode);
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

test('Should change parent if node existed', () => {
  const rootNode = new Node({ id: 1, data: { name: 'test1' } });
  const subNode1 = new Node({ id: 2, data: { name: 'test2' } });
  const subSubSubNode1 = new Node({ id: 5, data: { name: 'test5' } });
  const subSubSubNode2 = new Node({ id: 6, data: { name: 'test5' } });

  // Example data (category_id, sub_category_id): (2, 5), (2, 6), (1, 2)
  const tree = new Tree();
  tree.addNode(null, subNode1);
  tree.addNode(2, subSubSubNode1);

  tree.addNode(null, subNode1);
  tree.addNode(2, subSubSubNode2);

  tree.addNode(null, rootNode);
  tree.addNode(1, subNode1);

  expect(tree.rootNodes).toEqual([rootNode]);
  expect(rootNode.childNodes).toEqual([subNode1]);
  expect(subNode1.childNodes).toContainEqual(subSubSubNode1);
  expect(subNode1.childNodes).toContainEqual(subSubSubNode2);
  expect(subNode1.childNodes).toHaveLength(2);
});
