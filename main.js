class Node {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }


    getHeight(node) {
        if (!node) return 0;
        return node.height;
    }


    getBalance(node) {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    // Правый поворот
    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        // Поворот
        x.right = y;
        y.left = T2;

        // Обновление высот
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        return x;
    }

    // Левый поворот
    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        // Поворот
        y.left = x;
        x.right = T2;

        // Обновление высот
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y;
    }


    insert(node, key) {
        if (!node) return new Node(key);

        if (key < node.key)
            node.left = this.insert(node.left, key);
        else if (key > node.key)
            node.right = this.insert(node.right, key);
        else
            return node; // дубликаты не разрешены


        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));


        const balance = this.getBalance(node);

        // Левый Левый
        if (balance > 1 && key < node.left.key)
            return this.rightRotate(node);

        // Правый Правый
        if (balance < -1 && key > node.right.key)
            return this.leftRotate(node);

        // Левый Правый
        if (balance > 1 && key > node.left.key) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Правый Левый
        if (balance < -1 && key < node.right.key) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }


    InsertKey(key) {
        this.root = this.insert(this.root, key);
    }


    Print(node = this.root) {
        if (node) {
            // this.Print(node.left);
            // console.log(node.key);
            // this.Print(node.right);
            if (node == this.root)
                console.log( node.height + ': ' + node.key);
            
            if (node.left)
                console.log( node.left.height + ': ' + node.left.key);
            
            if (node.right)
                console.log(node.right.height + ': ' + node.right.key);

            this.Print(node.left);
            this.Print(node.right);
        }
    }
}

// === Пример использования ===
const tree = new AVLTree();
[10, 20, 30, 40, 50, 25, 35, 60, 55].forEach(k => tree.InsertKey(k));

console.log("Вывод: ");
tree.Print();
