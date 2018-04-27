var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);
let hashList = new LinkedList();
let listOfStrings = [];










//arr.push();



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






var listOfCodes = [ {type: "inst", location: 0,  opCode: "BZJi", opA : "3", opB: "17", comment: ""},
                    {type: "data", location: 1,  value: 0, comment: "//&($topofstack)"},
                    {type: "data", location: 2,  value: 0, comment: "//&($topofstack)"},
                    {type: "data", location: 3,  value: 0, comment: "//zero"},
                    {type: "data", location: 4,  value: 4294967295, comment: "//negativeOne"},
                    {type: "data", location: 5,  value: 0, comment: "//VSCPU-5"},
                    {type: "data", location: 6,  value: 0, comment: "//VSCPU-6"},
                    {type: "data", location: 7,  value: 0, comment: "//VSCPU-7"},
                    {type: "data", location: 8,  value: 0, comment: "//VSCPU-8"},
                    {type: "data", location: 9,  value: 0, comment: "//VSCPU-9"},
                    {type: "data", location: 10, value: 0, comment: "//VSCPU-10"},
                    {type: "data", location: 11, value: 0, comment: "//scratchMem1"},
                    {type: "data", location: 12, value: 0, comment: "//scratchMem2"},
                    {type: "data", location: 13, value: 0, comment: "//scratchMem3"},
                    {type: "data", location: 14, value: 0, comment: "//scratchMem4"},
                    {type: "data", location: 15, value: 0, comment: "//scratchMem5"},
                    {type: "data", location: 16, value: 0, comment: "//scratchMem6"},
                    {type: "inst", location: 17, opCode: "CPi",  opA : "11", opB: "24", comment: "// $globalinit:  //17 \n// Calling main, numArgs: 0"},
                    {type: "inst", location: 18, opCode: "CPIi", opA : "1",  opB: "11", comment: "// Push scratchMem1"},
                    {type: "inst", location: 19, opCode: "ADDi", opA : "1",  opB: "1",  comment: ""},
                    {type: "inst", location: 20, opCode: "CPIi", opA : "1",  opB: "2",  comment: "// Push basePointer"},
                    {type: "inst", location: 21, opCode: "ADDi", opA : "1",  opB: "1",  comment: ""},
                    {type: "inst", location: 22, opCode: "CP",   opA : "2",  opB: "1",  comment: "// Evaluating args.\n// Args evaluated.\n// Adjust BP to (SP - 0)"},
                    {type: "inst", location: 23, opCode: "BZJi", opA : "3",  opB: "27", comment: ""},
                    {type: "inst", location: 24, opCode: "ADD",  opA : "1",  opB: "4",  comment: "// $L2:  //24\n// Pop to scratchMem1"},
                    {type: "inst", location: 25, opCode: "CPI",  opA : "11", opB: "1",  comment: ""},
                    {type: "data", location: 26, value: 0, comment: "//HALT"}
];

function modifyTopOfStack(){
    listOfCodes[1].value = listOfCodes[listOfCodes.length-1].location + 1;
    listOfCodes[2].value = listOfCodes[listOfCodes.length-1].location + 1;
}

function printListOfCodes(){
    for(let i = 0; i<listOfCodes.length; i++){
        if(listOfCodes[i].type === "inst"){
            if(listOfCodes[i].comment.length > 0) console.log(listOfCodes[i].comment);
            console.log(listOfCodes[i].location + ": " + listOfCodes[i].opCode + " " + listOfCodes[i].opA + " " + listOfCodes[i].opB);
        }else if(listOfCodes[i].type === "data"){
            console.log(listOfCodes[i].location + ": " + listOfCodes[i].value + " " + listOfCodes[i].comment);
        }
    }
}

modifyTopOfStack();
printListOfCodes();



//----------------------- MAIN ---------------------------------
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





