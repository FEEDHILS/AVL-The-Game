class Node {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.balance = 0;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        return x;
    }

    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y;
    }

    insert(node, key, doBalance = true) {
        if (!node) return new Node(key);

        if (key < node.key) {
            node.left = this.insert(node.left, key, doBalance);
        } else if (key > node.key) {
            node.right = this.insert(node.right, key, doBalance);
        } else {
            return node;
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalance(node);
        node.balance = balance;
        if (!doBalance) return node;

        if (balance > 1 && key < node.left.key) return this.rightRotate(node);
        if (balance < -1 && key > node.right.key) return this.leftRotate(node);
        if (balance > 1 && key > node.left.key) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && key < node.right.key) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    insertKey(key, doBalance = true) {
        this.root = this.insert(this.root, key, doBalance);
    }

    print(node=this.root) {
        if (node)
        {
            const queue = [[node, 0, 0, 0]];
            const output = [];
            let maxDepth = 0;

            while (queue.length > 0) {
                const [current, pos, depth, bal] = queue.shift();
                output.push({ node: current, position: pos, depth: depth});
                
                if (current.left && !(current.left in output) ) queue.push([current.left, pos * 2, depth + 1]);
                if (current.right && !(current.right in output) ) queue.push([current.right, pos * 2 + 1, depth + 1]);
                
                maxDepth = (depth > maxDepth) ? depth : maxDepth;
            }

            return [output, maxDepth];
        }
    }
}

class TreeUI {
    constructor() {
        this.tree = new AVLTree();
        // this.elements = this.shuffleArray([10, 20, 30, 40, 50, 25, 35, 60, 55]);
        this.currentIndex = 0;
        this.maxLength = 8;
        this.intervalId = null;
        this.selectedNode = null;
        this.isBalancing = false;
        this.autoBalance = false;
        this.animationSpeed = 500;
        this.minValue = 1;
        this.paused = true;
        this.maxValue = 100;

        this.initUI();
    }

    initUI() {
        this.treeContainer = document.querySelector(".tree");
        this.startAddingNodes();
        // this.createControls();
        // this.updateStatus();
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    createControls() {
        const controls = document.createElement("div");
        controls.className = "controls";

        const startBtn = this.createButton("Start Adding", () => this.startAddingNodes());
        const addRandomBtn = this.createButton("Add Random", () => this.addRandomNode());
        const balanceBtn = this.createButton("Balance Tree", () => this.balanceTree());
        const pauseBtn = this.createButton("Pause", () => this.pauseAdding());
        
        this.autoBalanceToggle = this.createButton("Auto Balance: OFF", () => this.toggleAutoBalance());
        this.autoBalanceToggle.classList.add("toggle");

        controls.append(startBtn, addRandomBtn, balanceBtn, pauseBtn, this.autoBalanceToggle);
        document.body.insertBefore(controls, this.treeContainer);
    }

    createButton(text, onClick) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.addEventListener("click", onClick);
        return btn;
    }

    toggleAutoBalance() {
        this.autoBalance = !this.autoBalance;
        this.autoBalanceToggle.textContent = `Auto Balance: ${this.autoBalance ? "ON" : "OFF"}`;
        this.autoBalanceToggle.classList.toggle("active", this.autoBalance);
    }

    startAddingNodes() {
        // if (this.intervalId || this.isBalancing) return;
        
        // if (this.currentIndex < this.maxLength) {
        //     this.addRandomNode();
        // }
        if (this.paused) 
        {
            this.paused = false;
            this.intervalId = setInterval(() => {
            if (this.currentIndex < this.maxLength && !this.isBalancing) {
                this.addRandomNode();
            } else if (this.currentIndex >= this.maxLength) {
                this.pauseAdding();
                StartTheGame();
            }
            }, 2000);
        }

    }

    pauseAdding() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.paused = true;
        // this.updateStatus();
    }

    addNextNode() {
        const key = this.elements[this.currentIndex++];
        this.addNode(key);
    }

    addRandomNode() {
        const key = this.generateUniqueRandom();
        this.currentIndex++;
        this.addNode(key);
    }

    generateUniqueRandom() {
        let key;
        do {
            key = Math.floor(Math.random() * (this.maxValue - this.minValue + 1)) + this.minValue;
        } while (this.treeContains(key));
        return key;
    }

    addNode(key) {
        this.tree.insertKey(key, this.autoBalance);
        this.renderTree();
        // this.updateStatus();
    }

    treeContains(key, node = this.tree.root) {
        if (!node) return null;
        if (key === node.key) return node;
        return key < node.key 
            ? this.treeContains(key, node.left) 
            : this.treeContains(key, node.right);
    }

    async balanceTree() {
        if (this.isBalancing) return;
        
        this.isBalancing = true;
        // this.updateStatus();
        
        const wasAdding = !!this.intervalId;
        this.pauseAdding();

        try {
            await this.animateBalance();
        } finally {
            this.isBalancing = false;
            if (wasAdding && this.currentIndex < this.elements.length) {
                this.startAddingNodes();
            }
            // this.updateStatus();
        }
    }

    async animateBalance() {
        this.treeContainer.classList.add("balancing");
        
        // Анимация перед балансировкой
        await this.fadeOutTree();
        
        // Выполняем балансировку
        this.tree.root = this.balanceNode(this.tree.root);
        this.renderTree();
        this.checkBalance();
        
        // Анимация после балансировки
        await this.fadeInTree();
        
        this.treeContainer.classList.remove("balancing");
    }

    async fadeOutTree() {
        return new Promise(resolve => {
            this.treeContainer.style.transition = `opacity ${this.animationSpeed/2}ms`;
            this.treeContainer.style.opacity = "0.2";
            setTimeout(resolve, this.animationSpeed/2);
        });
    }

    async fadeInTree() {
        return new Promise(resolve => {
            this.treeContainer.style.opacity = "1";
            setTimeout(resolve, this.animationSpeed/2);
        });
    }

    balanceNode(node) {
        if (!node) return null;
        
        node.left = this.balanceNode(node.left);
        node.right = this.balanceNode(node.right);
        
        node.height = 1 + Math.max(
            this.tree.getHeight(node.left),
            this.tree.getHeight(node.right)
        );
        
        const balance = this.tree.getBalance(node);
        
        if (balance > 1) {
            if (this.tree.getBalance(node.left) >= 0) {
                return this.tree.rightRotate(node);
            } else {
                node.left = this.tree.leftRotate(node.left);
                return this.tree.rightRotate(node);
            }
        }
        
        if (balance < -1) {
            if (this.tree.getBalance(node.right) <= 0) {
                return this.tree.leftRotate(node);
            } else {
                node.right = this.tree.rightRotate(node.right);
                return this.tree.leftRotate(node);
            }
        }
        
        return node;
    }

    checkBalance() {
        document.querySelectorAll(".circle").forEach(el => {
            el.classList.remove("unbalanced", "critical");
        });
        
        const [layout] = this.tree.print();
        this.startAddingNodes();
        layout.forEach(item => {        
            console.log(item.node)

            if (item.node.balance > 1) {
                document.querySelector("#node-"+item.node.key).classList.add(item.node.balance > 2 ? "critical" : "unbalanced");
                this.pauseAdding();
            }
            if (item.node.balance < -1) {
                document.querySelector("#node-"+item.node.key).classList.add(item.node.balance > 2 ? "critical" : "unbalanced");
                this.pauseAdding();
            }

        });
    }

    renderTree() {
        this.treeContainer.innerHTML = "";
        // document.getElementById('treeLines').innerHTML = '';
        const [layout] = this.tree.print();
        
        layout.forEach(item => {
            this.createNodeElement(item);
        });
        
        this.checkBalance();
        // layout.forEach(item => {
        //     // this.createNodeElement(item);
        //     if (item.node.left)
        //         this.drawEdge(item.node.key, item.node.left.key);
        //     if (item.node.right)
        //         this.drawEdge(item.node.key, item.node.right.key);
        // });
    }

    createNodeElement(item) {
        const node = item.node;
        const element = document.createElement("div");
        element.className = "circle";
        element.id = `node-${node.key}`;
        element.innerHTML =  -node.balance + " <br> " + node.key;

        if (this.selectedNode && this.selectedNode[1].id == element.id) {
            element.classList = this.selectedNode[1].classList;
        }
        
        const size = 100 - 16*item.depth;
        const left = CalculatePosition(item.position, item.depth) - size + window.innerWidth/4;
        
        element.style.position = "absolute";
        element.style.left = `${left}px`;
        element.style.top = `${item.depth * 128}px`;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleNodeSelection(node, element);
        });
        
        this.treeContainer.appendChild(element);
    }

    drawEdge(parentKey, childKey) {
        const svg = document.getElementById('treeLines');
        const p = document.getElementById(`node-${parentKey}`).getBoundingClientRect();
        const c = document.getElementById(`node-${childKey}`).getBoundingClientRect();
        // координаты внутри SVG (от левого верхнего угла контейнера)
        const offset = this.treeContainer.getBoundingClientRect();
        const x1 = p.left + p.width/2  - offset.left;
        const y1 = p.top  + p.height/2 - offset.top;
        const x2 = c.left + c.width/2  - offset.left;
        const y2 = c.top  + c.height/2 - offset.top;
        
        const line = document.createElementNS(svg.namespaceURI, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#333');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
    }

    toggleNodeSelection(node, element) {
        console.log(this.selectedNode);
        
        if (this.selectedNode) {
            document.querySelector("#"+this.selectedNode[1].id).classList.remove("selected");
        }
        element.classList.add("selected");
        this.selectedNode = [node, element];
    }

    updateStatus() {
        let status = "Status: ";
        if (this.isBalancing) {
            status += "Balancing...";
        } else if (this.intervalId) {
            status += `Adding nodes (${this.currentIndex}/${this.elements.length})`;
        } else if (this.currentIndex >= this.elements.length) {
            status += "All nodes added";
        } else {
            status += "Ready";
        }
        
        if (!document.querySelector(".status")) {
            const statusElement = document.createElement("div");
            statusElement.className = "status";
            document.body.appendChild(statusElement);
        }
        
        document.querySelector(".status").textContent = status;
    }

      recalcAll(node = this.tree.root) {
    if (!node) return 0;
    const hl = this.recalcAll(node.left);
    const hr = this.recalcAll(node.right);
    node.height  = 1 + Math.max(hl, hr);
    node.balance = hl - hr;
    return node.height;
  }

  rotateSelected(direction) {
    if (!this.selectedNode) return;
    const [ node, el ] = this.selectedNode;

    // 2) Выполняем вращение и переподвешиваем
    let newSubRoot;
    if (direction === -1) {
      newSubRoot = this.tree.leftRotate(node);
    } else {
      newSubRoot = this.tree.rightRotate(node);
    }

    // 3) Привязываем newSubRoot вместо старого node
    if (node === this.tree.root) {
      this.tree.root = newSubRoot;
    } else {
      // нужно найти родителя и заменить ссылку
      const parent = this.findParent(this.tree.root, node.key);
      if (parent.left === node)  parent.left  = newSubRoot;
      else                         parent.right = newSubRoot;
    }

    // 4) Пересчитываем высоты/балансы от корня вниз
    this.recalcAll();

    // 5) Перерисовываем
    this.renderTree();
  }

  // Помощник для поиска родителя по ключу
  findParent(cur, key) {
    if (!cur) return null;
    if ((cur.left  && cur.left.key  === key) ||
        (cur.right && cur.right.key === key)) {
      return cur;
    }
    if (key < cur.key)  return this.findParent(cur.left,  key);
    else                return this.findParent(cur.right, key);
  }
}

function CalculatePosition(pos, depth) {
    const spacing = window.innerWidth/2 / (2**depth+1);
    return spacing * (pos + 1);
}


// Инициализация при загрузке страницы
let tree = null;
function StartTheGame()
{
    console.log("пора выпить зелье");
    const StartScreen = document.querySelector(".start");
    StartScreen.style.display = "None";
    document.querySelector(".controls").style.display = "flex";
    tree = new TreeUI();
}

function RotateLeft()
{
    tree.rotateSelected(-1);
}

function RotateRight()
{
    tree.rotateSelected(1);
}