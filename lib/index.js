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
