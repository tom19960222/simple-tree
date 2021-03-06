import _, { isNil } from 'lodash';

export interface NodeData {
  id: any;
  data: any;
}

export class Node<I, D> {
  public id: I;
  public data: D;
  public parentNodeId: I | null;
  public childNodes: Node<I, D>[];

  constructor(data: NodeData) {
    if (!data) throw new Error('Data cannot be null.');

    this.id = data.id;
    this.data = data.data || {};

    this.parentNodeId = null;
    this.childNodes = [];
  }

  public _setParentNodeId(parentNodeId: I | null): void {
    this.parentNodeId = parentNodeId;
  }

  public _addChildNode(node: Node<I, D>): void {
    this.childNodes.push(node);
  }

  public isRootNode(): boolean {
    return this.parentNodeId === null;
  }

  // eslint-disable-next-line
  public toJSON() {
    return {
      id: this.id,
      data: this.data,
      parentNodeId: this.parentNodeId,
      childNodes: this.childNodes,
    };
  }
}

export class Tree<I, D> {
  public rootNodes: Node<I, D>[];

  constructor(rootNode?: Node<I, D>[] | Node<I, D>) {
    this.rootNodes = _(rootNode || [])
      .castArray()
      .compact()
      .value();
  }

  public _findNode(nodeIdToFind: I, nodeList: Node<I, D>[]): Node<I, D> | null {
    let result = null;

    for (const node of nodeList) {
      if (node.id === nodeIdToFind) {
        return node;
      }
      if (node.childNodes.length > 0) {
        result = this._findNode(nodeIdToFind, node.childNodes);
      }

      if (result) break;
    }

    return result;
  }

  public findNode(nodeIdToFind: I | null): Node<I, D> | null {
    if (isNil(nodeIdToFind)) return null;
    return this._findNode(nodeIdToFind, this.rootNodes);
  }

  public _changeNodeParent(nodeId: I, newParentNodeId: I): void {
    const node = this.findNode(nodeId);
    if (!node)
      throw new Error(`Node id=${nodeId} not found when changing node parent.`);

    const oldParentNode = this.findNode(node.parentNodeId);
    const newParentNode = this.findNode(newParentNodeId);
    if (!newParentNode)
      throw new Error(
        `Node id=${newParentNodeId} not found when changing node parent.`
      );

    if (oldParentNode) {
      const indexInChildNodeOfOldParentNode = oldParentNode.childNodes.findIndex(
        (n) => n.id === nodeId
      );
      oldParentNode.childNodes.splice(indexInChildNodeOfOldParentNode, 1);
    }
    if (node.isRootNode()) {
      const indexInRootNodes = this.rootNodes.findIndex((n) => n.id === nodeId);
      this.rootNodes.splice(indexInRootNodes, 1);
    }

    if (!isNil(newParentNodeId)) {
      newParentNode.childNodes.push(node);
      node.parentNodeId = newParentNode.id;
    } else {
      this.rootNodes.push(node);
      node.parentNodeId = null;
    }
  }

  public attachNode(nodeId: I, attachToNodeId: I): void {
    return this._changeNodeParent(nodeId, attachToNodeId);
  }

  public addNode(parentNodeId: I | null, node: Node<I, D>): void {
    const existedNode = this.findNode(node.id);
    if (existedNode) {
      throw new Error('This node has been existed.');
    }

    if (_.isNil(parentNodeId)) {
      // Add a root node.
      this.rootNodes.push(node);
      node._setParentNodeId(null);
      return;
    }

    const parentNode = this.findNode(parentNodeId);
    if (!parentNode) {
      throw new Error('Parent node is not found.');
    }

    parentNode._addChildNode(node);
    node._setParentNodeId(parentNodeId);
  }

  public getAllChildNodes(nodeId: I): Node<I, D>[] {
    const nodeList: Node<I, D>[] = [];
    const nodeIdToWalk: I[] = [nodeId];

    let hasNextNode = true,
      i = 0;
    while (hasNextNode) {
      const node = this.findNode(nodeIdToWalk[i]);
      if (!node) break;

      nodeList.push(node);
      nodeIdToWalk.push(...node.childNodes.map((n) => n.id));

      if (nodeIdToWalk.length - 1 <= i) {
        hasNextNode = false;
      }
      i += 1;
    }

    return nodeList;
  }

  public getAllParentNodes(nodeId: I): Node<I, D>[] {
    const nodeList: Node<I, D>[] = [];
    let nextNodeId: I | null = nodeId;

    while (nextNodeId) {
      const node = this.findNode(nextNodeId);
      if (!node) break;

      nodeList.push(node);
      nextNodeId = node.parentNodeId;
    }

    return nodeList;
  }

  private getNodeRelationList(node: Node<I, D>): { parentId: I; childId: I }[] {
    return node.childNodes.map((childNode) => {
      return { parentId: node.id, childId: childNode.id };
    });
  }

  public getRelationList(): { parentId: I | null; childId: I }[] {
    const rootNodesRelationList: {
      parentId: I | null;
      childId: I;
    }[] = this.rootNodes.map((rootNode) => {
      return {
        parentId: null,
        childId: rootNode.id,
      };
    });

    const allChildNodesOfRootNodes = _.flatten(
      this.rootNodes.map((rootNode) => {
        return this.getAllChildNodes(rootNode.id);
      })
    );

    const childNodesRelationList = _.flatten(
      allChildNodesOfRootNodes.map((node) => this.getNodeRelationList(node))
    );

    return [...rootNodesRelationList, ...childNodesRelationList];
  }
}
