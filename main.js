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


    insert(node, key, doBalance=true) {
        if (!node) return new Node(key);

        if (key < node.key)
            node.left = this.insert(node.left, key, doBalance);
        else if (key > node.key)
            node.right = this.insert(node.right, key, doBalance);
        else
            return node; // дубликаты не разрешены

        if (!doBalance)
            return node;

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


    InsertKey(key, doBalance=true) {
        this.root = this.insert(this.root, key, doBalance);
    }


    Print(node = this.root) {
        if (node) {
            // Node, Position(Left to Right), Depth
            let queue = [ [node, 0, 0] ];
            let output = [  ];
            let maxDepth = 0;
            while(queue.length > 0)
            {
                const [current, pos, depth] = queue.shift();
                output.push( {"Node" : current, "Position": pos, "Depth": depth} );

                if ( current.left && !(current.left in output) )
                    queue.push( [current.left, pos*2, depth+1] );

                if ( current.right && !(current.right in output) )
                    queue.push( [current.right, pos*2+1, depth+1] );

                maxDepth = (depth > maxDepth) ? depth : maxDepth;
            }

            console.log(output);
            return [output, maxDepth];
        }
    }
}

// Тестовые Данные для Дерева
const tree = new AVLTree();
const elements = [10, 20, 30, 40, 50, 25, 35, 60, 55];
elements.forEach(k => tree.InsertKey(k));
tree.InsertKey(70, false); // Неотбалансированный элемент для теста

let [Layout, maxDepth] = tree.Print(); // Возвращает набор вида (Нод, Позиция, Глубина). Используется BFS алгоритм (Поиск в ширину).




function CalculatePosition(pos, depth)
{
    const spacing = window.innerWidth/2 / (2**depth+1);
    return spacing * (pos+1);
}

const TreeContainer = document.querySelector(".tree");
function CreateNode(layoutElement)
{
    const child = document.createElement("div");
    child.className = "circle";
    child.id = "id"+layoutElement.Node.key;
    child.textContent = layoutElement.Node.key;

    const NodeSize = 64; // Захардкоженный размер ноды (64x64), очень плохо...(не дай бог его в css поменять)
    
    // Код снизу отвечает за позиционирование нодов, TODO: Сделать его адаптивным!!
    child.style.position = "absolute";

    
    child.style.left = CalculatePosition(layoutElement.Position, layoutElement.Depth) - NodeSize/2 + window.innerWidth/4 + "px";
    child.style.top = layoutElement.Depth * 148 + "px";


    TreeContainer.appendChild(child);
}


// Инициализация начальных элементов дерева
for (const i in Layout) {
    CreateNode(Layout[i]);
}