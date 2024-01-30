const mergeSort = (arr: number[]) => { 
    if (arr.length > 1)
    {
        let i = 0;
        let j = 0;
        let k = 0;
        let sorted = [];
        let mid = (arr.length / 2);
        let first = mergeSort(arr.slice(0, mid));
        let scnd = mergeSort(arr.slice(mid)); 
        while (i < first.length && j < scnd.length)
        {
            if (first[i] < scnd[j])
            {
                sorted[k++] = first[i++];
            }
            else
            {
                sorted[k++] = scnd[j++];
            }
        }
        if (i === first.length) {
           sorted = sorted.concat(scnd.slice(j))
        }
        else 
        {
            sorted = sorted.concat(first.slice(i));
        }
        return sorted;
    }
    else 
    {
        return arr;
    }
}

const unique = (arr: number[]) => { return [... new Set(arr)] };

const randNumArr = (num: number, max: number, min: number): number[] => { 
    const vals = []
    for (let i = 0; i < num; i++)
    {
        vals.push(Math.floor(Math.random() * (max - min) + min));
    }
    return vals;
}

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

class TreeNode
{
    protected _data: number;
    protected _left: TreeNode;
    protected _right: TreeNode;

    constructor(data: any)
    {
        this._data = data;
        this._left = null;
        this._right = null;
    }

    public get data() { return this._data };
    public set data(val: number) { this._data = val };
    public get left() { return this._left };
    public set left(node: TreeNode) { this._left = node};
    public get right() { return this._right };
    public set right(node: TreeNode) { this._right = node };
}

class Tree
{
    protected _root: TreeNode;

    constructor(arr: number[])
    {
        const sorted = unique(mergeSort(arr));
        this._root = this.buildTree(sorted);
    }

    public get root() { return this._root };

    public insert(value: number, node: TreeNode = this._root)
    {   
        if (!this._root) { 
            this._root = new TreeNode(value);
            return
        };

        if (node === null) { return new TreeNode(value)};

        if (value < node.data)
        {
            node.left = this.insert(value, node.left);
        }
        else if (value > node.data)
        {
            node.right = this.insert(value, node.right);
        }

        return node;
    }

    public delete(value: number, node: TreeNode = this._root)
    {
        if (node == null) { return };

        if (value < node.data) 
        {
            node.left = this.delete(value, node.left);
            return node;
        }
        else if (value > node.data)
        {
            node.right = this.delete(value, node.right);
        }

        if (node.left == null)
        {
            const temp = node.right;
            node.right = null;
            return temp;
        }
        else if (node.right == null)
        {
            const temp = node.left;
            node.left = null;
            return temp;
        }
        else
        {
            let nextParent = node;
            let next = nextParent.right;
            while (next.left != null)
            {
                nextParent = next;
                next = nextParent.left;
            }

            if (nextParent != node)
            {
                nextParent.left = next.right;
            }
            else 
            {
                nextParent.right = next.right;
            }

            node.data = next.data;
            next = null;
            return node;
        }
    }

    public find(value: number, node: TreeNode = this._root): TreeNode
    {
        if (node == null || node.data === value) 
        { 
            return node 
        }
        
        if (value < node.data)
        {
            return this.find(value, node.left);
        }
        else
        {
            return this.find(value, node.right);
        }
    }

    public levelOrder(cb?: (node: TreeNode) => any)
    {
        const queue = [this._root];
        const vals = [];
        while (queue.length > 0)
        {
            const curr = queue.shift();
            cb ? cb(curr) : vals.push(curr.data);
            if (curr.left) { queue.push(curr.left)};
            if (curr.right) { queue.push(curr.right) };
        }

        if (!cb)
        {
            return vals;
        }
    }

    public preOrder(node: TreeNode = this._root, cb?: (node: TreeNode) => any)
    {
        if (node == null) return cb ? null : [];
        if (cb) 
        {
            cb(node);
            this.preOrder(node.left, cb);
            this.preOrder(node.right, cb);
            return;
        }
        else
        {
            return [node.data].concat(this.preOrder(node.left)).concat(this.preOrder(node.right));
        }
    }

    public inOrder(node: TreeNode = this._root, cb?: (node: TreeNode) => any)
    {
        if (node == null) return cb ? null : [];
        if (cb) 
        {
            this.inOrder(node.left, cb);
            cb(node);
            this.inOrder(node.right, cb);
            return;
        }
        else
        {
            return this.inOrder(node.left).concat(node.data).concat(this.inOrder(node.right));
        }
    }

    public postOrder(node: TreeNode = this._root, cb?: (node: TreeNode) => any)
    {
        if (node == null) return cb ? null : [];
        if (cb) 
        {
            this.postOrder(node.left, cb);
            this.postOrder(node.right, cb);
            cb(node);
            return;
        }
        else
        {
            return this.postOrder(node.left).concat(this.postOrder(node.right)).concat(node.data);
        }
    }

    public height(node: TreeNode)
    {
        if (!node || !node.left && !node.right) return 0 ;
        let leftHeight: number = 0;
        let rightHeight: number = 0;
        if (node.left) {
           leftHeight = this.height(node.left)
        }

        if (node.right)
        {
            rightHeight = this.height(node.right);
        }
        let val = Math.max(leftHeight, rightHeight) + 1;
        return val;
    }

    public depth(node: TreeNode, checkNode: TreeNode = this._root)
    {
        if (checkNode === node) { return 0 };
        if (checkNode.left === node || checkNode.right === node) { return 1 };

        if (node.data < checkNode.data)
        {
            return 1 + this.depth(node, checkNode.left);
        }
        else
        {
            return 1 + this.depth(node, checkNode.right);
        }
    }

    public isBalanced()
    {
        return this.isBalancedUtil() === -1 ? false : true;
    }

    public rebalance()
    {
        const sorted = this.inOrder();
        this._root = this.buildTree(sorted);
    }

    protected isBalancedUtil(node: TreeNode = this._root)
    {
        if (node == null) { return 0};

        let leftHeight = this.isBalancedUtil(node.left);
        if (leftHeight == -1) { return -1 };

        let rightHeight = this.isBalancedUtil(node.right);
        if (rightHeight == -1 ) { return -1 };

        if (Math.abs(leftHeight - rightHeight) > 1)
        {
            return -1;
        }

        return (Math.max(leftHeight, rightHeight) + 1); 
    }

    protected buildTree(arr: number[])
    {
        if (arr.length === 0) { return null };
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid + 1);
        const root = new TreeNode(arr[mid]);
        root.left = this.buildTree(left);
        root.right = this.buildTree(right);
        return root;
    }
}

const driver = (num: number) => { 
    let vals = randNumArr(num, 100, 0);
    const tree = new Tree(vals);
    console.log(tree.isBalanced());
    console.log(tree.levelOrder());
    console.log(tree.preOrder());
    console.log(tree.postOrder());
    console.log(tree.inOrder());
    prettyPrint(tree.root);
    for (let i = 0; i < Math.floor(num / 2); i++)
    {
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
}

driver (10);