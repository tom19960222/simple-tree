const _ = require('lodash');

class Node {
  constructor(data = {}) {
    this.id = data.id;
    this.data = data.data || {};

    this.parentNodeId = null;
    this.childNodes = [];
  }

  _setParentNodeId(parentNodeId) {
    this.parentNodeId = parentNodeId;
  }

  _addChildNode(node) {
    this.childNodes.push(node);
  }

  isRootNode() {
    return this.parentNodeId === null;
  }
}

class Tree {
  constructor(rootNode) {
    this.rootNodes = _(rootNode).castArray().compact().value();
  }

  _findNode(nodeIdToFind, nodeList) {
    let result;

    for (const node of nodeList) {
      if (node.id === nodeIdToFind) { return node; }
      if (node.childNodes.length > 0) { result = this._findNode(nodeIdToFind, node.childNodes); }

      if (result) break;
    }

    return result;
  }

  findNode(nodeIdToFind) {
    return this._findNode(nodeIdToFind, this.rootNodes);
  }

  _changeNodeParent(nodeId, newParentNodeId) {
    const node = this.findNode(nodeId);

    const oldParentNode = this.findNode(node.parentNodeId);
    const newParentNode = this.findNode(newParentNodeId);

    if (oldParentNode) {
      const indexInChildNodeOfOldParentNode = oldParentNode.childNodes.findIndex(n => n.id === nodeId);
      oldParentNode.childNodes.splice(indexInChildNodeOfOldParentNode, 1);
    }
    if (node.isRootNode()) {
      const indexInRootNodes = this.rootNodes.findIndex(n => n.id === nodeId);
      this.rootNodes.splice(indexInRootNodes, 1);
    }

    if (newParentNodeId) newParentNode.childNodes.push(node);
    else this.rootNodes.push(node);
  }

  attachNode(nodeId, attachToNodeId) {
    return this._changeNodeParent(nodeId, attachToNodeId);
  }

  addNode(parentNodeId, node) {
    const existedNode = this.findNode(node.id);
    if (existedNode) {
      throw new Error('This node has been existed.');
    }

    if (!parentNodeId) { // Add a root node.
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

  getAllChildNodes(nodeId) {
    const nodeList = [];
    const nodeIdToWalk = [nodeId];

    let hasNextNode = true; let
      i = 0;
    while (hasNextNode) {
      const node = this.findNode(nodeIdToWalk[i]);
      if (!node) break;

      nodeList.push(node);
      nodeIdToWalk.push(...(node.childNodes.map(n => n.id)));

      if (nodeIdToWalk.length - 1 <= i) { hasNextNode = false; }
      i += 1;
    }

    return nodeList;
  }

  getAllParentNodes(nodeId) {
    const nodeList = [];
    let nextNodeId = nodeId;

    while (nextNodeId) {
      const node = this.findNode(nextNodeId);
      if (!node) break;

      nodeList.push(node);
      nextNodeId = node.parentNodeId;
    }

    return nodeList;
  }
}

module.exports = { Node, Tree };
