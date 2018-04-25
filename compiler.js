var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);
let hashList = new LinkedList();
//List of Strings

let stackPointer   = 1;
let basePointer    = 2;
let zero           = 3;
let negativeOne    = 4;
let vscpuSpecials  = [5,6,7,8,9,10];
let scratchMem1    = 11;
let scratchMem2    = 12;
let scratchMem3    = 13;
let scratchMem4    = 14;
let scratchMem5    = 15;
let scratchMem6    = 16;
let globalDataBase = 17;

LinkedList.prototype.add = function(value) {
    var node = new Node(value),
        currentNode = this.head;

    // 1st use-case: an empty list
    if (!currentNode) {
        this.head = node;
        this.length++;
        return node;
    }


    /*
    // 2nd use-case: a non-empty list
    while (currentNode.next) {
        currentNode = currentNode.next;
    }
    currentNode.next = node;
    */
    node.next = currentNode;
    this.head = node;

    this.length++;
    return node;
};

/*
LinkedList.prototype.get = function(num) {
    var nodeToCheck = this.head,
        count = 0;
    // a little error checking
    if(num > this.length) {
        return "Doesn't Exist!"
    }
    // find the node we're looking for
    while(count < num) {
        nodeToCheck = nodeToCheck.next;
        count++;
    }
    return nodeToCheck;
};
*/

LinkedList.prototype.getHead = function(){
    if(!hashList.head) return null;
    var headHashList = hashList.head;
    return headHashList.data;
};

LinkedList.prototype.removeHead = function() {
    if (!this.head) return null;
    let value = this.head.value;
    this.head = this.head.next;

    //if (this.head) this.head.prev = null;
    //else this.tail = null;

    return value;
};



function increaseSP(){
    stackPointer ++;
}

function decreaseSP(){
    stackPointer --;
}


for(let i = 0; i < myJSon.length; i++) {
    decideDeclaration(myJSon[i]);
}



function decideDeclaration(JSonObject) {
    var declaration =  JSonObject.type;

    switch(declaration) {
        case("FunctionDeclaration"):
            for(let i = 0; i < JSonObject.body.length; i++) {
                declarationOrStatement(JSonObject.body[i]);
            }

        case("GlobalVariableDeclaration"):
        //var name = JSonObject.name;
        //var value = declarationOrStatement(JSonObject)
        //addToEnvironment(name);
    }
}



function declarationOrStatement(JSonBody){
    if(JSonBody.type === "VariableDeclaration"){
        var name = JSonBody.name;
        addToEnvironment(name);
        return;
    }else{
        decideStatement(JSonBody);
        return;
    }
}



function decideStatement(JSonBody) {
    decideDeclaration(JSonBody);
    let currentStatement = JSonBody.type;
    switch (currentStatement) {
        case("IfStatement"):
            var hashTable = new HashTable({});
            hashList.add(hashTable);
            var conditionType = JSonBody.condition;
            decideExpression(conditionType);
            for (let i = 0; i < JSonBody.body.length; i++) {
                var thenStatement = JSonBody.body[i];
                declarationOrStatement(thenStatement);
            }
            if (doesElseExist(JSonBody) == true) {
                for (let j = 0; j < JSonBody.body.length; j++) {
                    var thenStatement = JSonBody.body[j];
                    declarationOrStatement(thenStatement);
                }
            }
            hashList.removeHead();
            return;
        case("ExpressionStatement"):
            decideExpression(JSonBody.expression);
            return;
        case("ForStatement"):
            var hashTable = new HashTable({});
            hashList.add(hashTable);
            var init = JSonBody.init;
            declarationOrStatement(init);
            var condition = JSonBody.condition;
            decideExpression(condition);
            var step = JSonBody.step;
            decideExpression(step);
            for (let i = 0; i < JSonBody.body.length; i++) {
                var bodyElement = JSonBody.body[i];
                declarationOrStatement(bodyElement);
            }
            hashList.removeHead();
            return;
        case("WhileStatement"):
            var hashTable = new HashTable({});
            hashList.add(hashTable);
            var condition = JSonBody.condition;
            decideExpression(condition);
            for (let i = 0; i < JSonBody.body.length; i++) {
                var bodyElement = JSonBody.body[i];
                declarationOrStatement(bodyElement);
            }
            hashList.removeHead();
            return;
        case("ReturnStatement"):
            var value = JSonBody.value;
            decideExpression(value);
            hashList.removeHead();
            return;
    }
}



function decideExpression(expression) {
    var expressionType = expression.type;
    switch (expressionType) {
        case ("Literal"):
            var value = expression.value;
            //addToEnvironment(key);
            return value;
        case ("Identifier"):
            var value = expression.value;
            //addToEnvironment(value);
            return value;
        case ("BinaryExpression"):
            var operator = expression.operator;
            var leftValue = decideExpression(expression.left);
            var rightValue = decideExpression(expression.right);
            var result = doBinaryExpression(operator, leftValue, rightValue);
            return result;
        case ("PrefixExpression"):
            var operator = expression.operator;
            var value = decideExpression(expression.value);
        case ("SuffixExpression"):
            var operator = expression.operator;
            var value = decideExpression(expression.value);
        case ("CastExpression"):
        //TODO
        case ("CallExpression"):


        case ("IndexExpression"):
        //Array
    }
}



function doesElseExist(JSonBody) {
    if(typeof JSonBody.else == 'undefined'){
        return false;
    }else{
        return true;
    }
}




function doBinaryExpression(operator, leftValue, rightValue){

    switch(operator){
        case("="):
            console.log(leftValue, rightValue);
        case("+"):
            return leftValue + rightValue;
        case("-"):

        case("/"):

        case("*"):

        case("&&"):

        case("||"):

        case("&"):

        case("|"):

        case("<"):
            return;
        case("<="):

        case(">"):

        case(">="):

    }

}




function doSuffixExpression(operator, value){
    //prefix?? --> herşey oluyo
    switch(operator){
        case("++"):

        case("--"):

    }
}

function decideInstruction(instr) {

}

//Values are adding to the Hash Table
function addToEnvironment(key) {
    if(hashList.length > 0){
        //hashTable = hashList.get(0);
        hashTable = hashList.getHead();
    }else{
        var hashTable = new HashTable({});
        hashList.add(hashTable);
    }
    hashTable.setItem(key, hashTable.getNextIndex());
    hashTable.nextIndex += 1;
}

function lookup(key) {
    for (let i = 0; i < hashList.length; i++) {
        hashTable = hashList.get(i);
        if (hashTable.hasItem(key)) {
            return hashTable.getItem(key);
        }
    }
}



function removeFromEnvironment(key) {
    for (let i = 0; i < hashList.length; i++) {
        hashTable = hashList.get(i);
        if (hashTable.hasItem(key)) {
            hashTable.removeItem(key);
            break;
        }
    }
}





//----------------------- Hash Table ---------------------------------

function HashTable(obj) {
    this.length = 0;
    this.nextIndex = 0;
    this.items = {};

    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }


    this.getNextIndex = function () {
        return this.nextIndex;
    };

    this.setItem = function (key, value) {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    };

    this.getItem = function (key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    };

    this.hasItem = function (key) {
        return this.items.hasOwnProperty(key);
    };

    this.removeItem = function (key) {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }else {
            return undefined;
        }
    };

    this.keys = function () {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    this.values = function () {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    };

    this.each = function (fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    };

    this.clear = function () {
        this.items = {};
        this.length = 0;
    }
}




//----------------------- Linked List ---------------------------------
function Node(data) {
    this.data = data;
    this.next = null;
}



function LinkedList() {
    // head will be the top of the list
    // we'll define it as null for now
    this.head = null;
    this.length = 0;

    /*
    this.add = function(data) {
        var nodeToAdd = new Node(data),
            nodeToCheck = this.head;
        // if the head is null
        if(!nodeToCheck) {
            this.head = nodeToAdd;
            this.length++;
            return nodeToAdd;
        }
        // loop until we find the end
        while(nodeToCheck.next) {
            nodeToCheck = nodeToCheck.next;
        }
        // once were at the end of the list
        nodeToCheck.next = nodeToAdd;
        this.length++;
        return nodeToAdd;
    };
    */

}








/*
LinkedList.prototype.search = function(searchValue) {
    let currentNode = this.head;

    while(currentNode) {
        if (currentNode.value === searchValue) return currentNode;
        currentNode = currentNode.next;
    }
    return null;
}
*/








