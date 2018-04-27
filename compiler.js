var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);
let hashList = new LinkedList();
var listOfInstructions;
let listOfStrings = [];

//let stack = new HashTable({});







var arr = [ {},
            {name : "stackPointer",    location: 1,    value :  0},
            {name : "basePointer",     location: 2,    value :  0},
            {name : "zero",            location: 3,    value :  0 },
            {name : "negativeOne",     location: 4,    value :  4294967295 },
            {name : "VSCPU-5",         location: 5,    value :  0 },
            {name : "VSCPU-6",         location: 6,    value :  0 },
            {name : "VSCPU-7",         location: 7,    value :  0 },
            {name : "VSCPU-8",         location: 8,    value :  0 },
            {name : "VSCPU-9",         location: 9,    value :  0 },
            {name : "VSCPU-10",        location: 10,   value :  0 },
            {name : "scratchMem1",     location: 11,   value :  0 },
            {name : "scratchMem2",     location: 12,   value :  0 },
            {name : "scratchMem3",     location: 13,   value :  0 },
            {name : "scratchMem4",     location: 14,   value :  0 },
            {name : "scratchMem5",     location: 15,   value :  0 },
            {name : "scratchMem6",     location: 16,   value :  0 },
        ];

//arr.push();

/*
var stackPointer   = 0;
var basePointer    = 0;
var zero           = 0;
var negativeOne    = 4294967295;
var VSCPU5         = 0;
var VSCPU6         = 0;
var VSCPU7         = 0;
var VSCPU8         = 0;
var VSCPU9         = 0;
var VSCPU10        = 0;
var scratchMem1    = 0;
var scratchMem2    = 0;
var scratchMem3    = 0;
var scratchMem4    = 0;
var scratchMem5    = 0;
var scratchMem6    = 0;
var globalDataBase = 0;


stack.setItem(1,  stackPointer);
stack.setItem(2,  basePointer);
stack.setItem(3,  zero);
stack.setItem(4,  negativeOne);
stack.setItem(5,  VSCPU5);
stack.setItem(6,  VSCPU6);
stack.setItem(7,  VSCPU7);
stack.setItem(8,  VSCPU8);
stack.setItem(9,  VSCPU9);
stack.setItem(10, VSCPU10);
stack.setItem(11, scratchMem1);
stack.setItem(12, scratchMem2);
stack.setItem(13, scratchMem3);
stack.setItem(14, scratchMem4);
stack.setItem(15, scratchMem5);
stack.setItem(16, scratchMem6);
stack.setItem(17, globalDataBase);


stack.setItem(1,  arr[0].value);
stack.setItem(2,  arr[1].value);
stack.setItem(3,  arr[2].value);
stack.setItem(4,  arr[3].value);
stack.setItem(5,  arr[4].value);
stack.setItem(6,  arr[5].value);
stack.setItem(7,  arr[6].value);
stack.setItem(8,  arr[7].value);
stack.setItem(9,  arr[8].value);
stack.setItem(10, arr[9].value);
stack.setItem(11, arr[10].value);
stack.setItem(12, arr[11].value);
stack.setItem(13, arr[12].value);
stack.setItem(14, arr[13].value);
stack.setItem(15, arr[14].value);
stack.setItem(16, arr[15].value);
stack.setItem(17, arr[16].value);
*/


//----------------------- Linked List ---------------------------------
LinkedList.prototype.add = function(value) {
    var node = new Node(value);
    var currentNode = this.head;

    if (!currentNode) {
        this.head = node;
        this.length++;
        return node;
    }

    node.next = currentNode;
    this.head = node;

    this.length++;
    return node;
};


LinkedList.prototype.getHead = function(){
    if(!this.head) return null;
    var headHashList = this.head;
    return headHashList.data;
};

LinkedList.prototype.removeHead = function() {
    if (!this.head) return null;
    this.head = this.head.next;
    this.length--;
    //DELETE THE PREVIOUS HEAD
};



//----------------------- MAIN ---------------------------------


fillListOfStrings();
printListOfStrings();

function fillListOfStrings(){
    //arr.push({name: })
    //listOfStrings[0] = "BZJi ".concat(arr[3].location + " ", arr[16].location);
    for(let i = 1; i < arr.length; i++){
        listOfStrings[i] = arr[i].value+" ".concat(" //" + arr[i].name);
    }
}

function printListOfStrings(){
    console.log("0: ".concat(listOfStrings[0]));
    for(let i = 1; i<listOfStrings.length; i++){
        console.log(i + ": " + listOfStrings[i] );
    }
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
        var hashTable = hashList.get(i);
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
    this.head = null;
    this.length = 0;
}

/*
LinkedList.prototype.get = function(num) {
    var nodeToCheck = this.head;
    var count = 0;
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





