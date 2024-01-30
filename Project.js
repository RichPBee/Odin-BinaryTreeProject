const mergeSort = (arr) => {
    if (arr.length > 1) {
        let i = 0;
        let j = 0;
        let k = 0;
        let sorted = [];
        let mid = (arr.length / 2);
        let first = mergeSort(arr.slice(0, mid));
        let scnd = mergeSort(arr.slice(mid));
        while (i < first.length && j < scnd.length) {
            if (first[i] < scnd[j]) {
                sorted[k++] = first[i++];
            }
            else {
                sorted[k++] = scnd[j++];
            }
        }
        if (i === first.length) {
            sorted = sorted.concat(scnd.slice(j));
        }
        else {
            sorted = sorted.concat(first.slice(i));
        }
        return sorted;
    }
    else {
        return arr;
    }
};
const unique = (arr) => { return [...new Set(arr)]; };
const randNumArr = (num, max, min) => {
    const vals = [];
    for (let i = 0; i < num; i++) {
        vals.push(Math.floor(Math.random() * (max - min) + min));
    }
    return vals;
};
const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};
class TreeNode {
    constructor(data) {
        this._data = data;
        this._left = null;
        this._right = null;
    }
    get data() { return this._data; }
    ;
    set data(val) { this._data = val; }
    ;
    get left() { return this._left; }
    ;
    set left(node) { this._left = node; }
    ;
    get right() { return this._right; }
    ;
    set right(node) { this._right = node; }
    ;
}
class Tree {
    constructor(arr) {
        const sorted = unique(mergeSort(arr));
        this._root = this.buildTree(sorted);
    }
    get root() { return this._root; }
    ;
    insert(value, node = this._root) {
        if (!this._root) {
            this._root = new TreeNode(value);
            return;
        }
        ;
        if (node === null) {
            return new TreeNode(value);
        }
        ;
        if (value < node.data) {
            node.left = this.insert(value, node.left);
        }
        else if (value > node.data) {
            node.right = this.insert(value, node.right);
        }
        return node;
    }
    delete(value, node = this._root) {
        if (node == null) {
            return;
        }
        ;
        if (value < node.data) {
            node.left = this.delete(value, node.left);
            return node;
        }
        else if (value > node.data) {
            node.right = this.delete(value, node.right);
        }
        if (node.left == null) {
            const temp = node.right;
            node.right = null;
            return temp;
        }
        else if (node.right == null) {
            const temp = node.left;
            node.left = null;
            return temp;
        }
        else {
            let nextParent = node;
            let next = nextParent.right;
            while (next.left != null) {
                nextParent = next;
                next = nextParent.left;
            }
            if (nextParent != node) {
                nextParent.left = next.right;
            }
            else {
                nextParent.right = next.right;
            }
            node.data = next.data;
            next = null;
            return node;
        }
    }
    find(value, node = this._root) {
        if (node == null || node.data === value) {
            return node;
        }
        if (value < node.data) {
            return this.find(value, node.left);
        }
        else {
            return this.find(value, node.right);
        }
    }
    levelOrder(cb) {
        const queue = [this._root];
        const vals = [];
        while (queue.length > 0) {
            const curr = queue.shift();
            cb ? cb(curr) : vals.push(curr.data);
            if (curr.left) {
                queue.push(curr.left);
            }
            ;
            if (curr.right) {
                queue.push(curr.right);
            }
            ;
        }
        if (!cb) {
            return vals;
        }
    }
    preOrder(node = this._root, cb) {
        if (node == null)
            return cb ? null : [];
        if (cb) {
            cb(node);
            this.preOrder(node.left, cb);
            this.preOrder(node.right, cb);
            return;
        }
        else {
            return [node.data].concat(this.preOrder(node.left)).concat(this.preOrder(node.right));
        }
    }
    inOrder(node = this._root, cb) {
        if (node == null)
            return cb ? null : [];
        if (cb) {
            this.inOrder(node.left, cb);
            cb(node);
            this.inOrder(node.right, cb);
            return;
        }
        else {
            return this.inOrder(node.left).concat(node.data).concat(this.inOrder(node.right));
        }
    }
    postOrder(node = this._root, cb) {
        if (node == null)
            return cb ? null : [];
        if (cb) {
            this.postOrder(node.left, cb);
            this.postOrder(node.right, cb);
            cb(node);
            return;
        }
        else {
            return this.postOrder(node.left).concat(this.postOrder(node.right)).concat(node.data);
        }
    }
    height(node) {
        if (!node || !node.left && !node.right)
            return 0;
        let leftHeight = 0;
        let rightHeight = 0;
        if (node.left) {
            leftHeight = this.height(node.left);
        }
        if (node.right) {
            rightHeight = this.height(node.right);
        }
        let val = Math.max(leftHeight, rightHeight) + 1;
        return val;
    }
    depth(node, checkNode = this._root) {
        if (checkNode === node) {
            return 0;
        }
        ;
        if (checkNode.left === node || checkNode.right === node) {
            return 1;
        }
        ;
        if (node.data < checkNode.data) {
            return 1 + this.depth(node, checkNode.left);
        }
        else {
            return 1 + this.depth(node, checkNode.right);
        }
    }
    isBalanced() {
        return this.isBalancedUtil() === -1 ? false : true;
    }
    rebalance() {
        const sorted = this.inOrder();
        this._root = this.buildTree(sorted);
    }
    isBalancedUtil(node = this._root) {
        if (node == null) {
            return 0;
        }
        ;
        let leftHeight = this.isBalancedUtil(node.left);
        if (leftHeight == -1) {
            return -1;
        }
        ;
        let rightHeight = this.isBalancedUtil(node.right);
        if (rightHeight == -1) {
            return -1;
        }
        ;
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return -1;
        }
        return (Math.max(leftHeight, rightHeight) + 1);
    }
    buildTree(arr) {
        if (arr.length === 0) {
            return null;
        }
        ;
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid + 1);
        const root = new TreeNode(arr[mid]);
        root.left = this.buildTree(left);
        root.right = this.buildTree(right);
        return root;
    }
}
const driver = (num) => {
    let vals = randNumArr(num, 100, 0);
    const tree = new Tree(vals);
    console.log(tree.isBalanced());
    console.log(tree.levelOrder());
    console.log(tree.preOrder());
    console.log(tree.postOrder());
    console.log(tree.inOrder());
    prettyPrint(tree.root);
    for (let i = 0; i < Math.floor(num / 2); i++) {
        const newVal = Math.floor(Math.random() * (150 - 100) + 100);
        tree.insert(newVal);
    }
    prettyPrint(tree.root);
    console.log(tree.isBalanced());
    tree.rebalance();
    console.log(tree.isBalanced());
    console.log(tree.levelOrder());
    console.log(tree.preOrder());
    console.log(tree.postOrder());
    console.log(tree.inOrder());
    prettyPrint(tree.root);
};
driver(10);
//# sourceMappingURL=Project.js.map