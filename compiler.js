var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);
let hashList = new LinkedList();
var lookupVar;
var functionCount = 1;

//arr.push();


//----------------------- Linked List ---------------------------------
LinkedList.prototype.add = function (value) {
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


LinkedList.prototype.getHead = function () {
    if (!this.head) return null;
    var headHashList = this.head;
    return headHashList.data;
};

LinkedList.prototype.removeHead = function () {
    if (!this.head) return null;
    this.head = this.head.next;
    this.length--;
    //DELETE THE PREVIOUS HEAD
};


LinkedList.prototype.getNext = function () {
    return this.next;
};


function getMemoryAdress(name) {
    if (name === "stackPointer") {
        return "1";
    } else if (name === "basePointer") {
        return "2";
    } else if (name === "zero") {
        return "3";
    } else if (name === "negativeOne") {
        return "4";
    } else if (name === "VSCPU-5") {
        return "5";
    } else if (name === "VSCPU-6") {
        return "6";
    } else if (name === "VSCPU-7") {
        return "7";
    } else if (name === "VSCPU-8") {
        return "8";
    } else if (name === "VSCPU-9") {
        return "9";
    } else if (name === "VSCPU-10") {
        return "10";
    } else if (name === "scratchMem1") {
        return "11";
    } else if (name === "scratchMem2") {
        return "12";
    } else if (name === "scratchMem3") {
        return "13";
    } else if (name === "scratchMem4") {
        return "14";
    } else if (name === "scratchMem5") {
        return "15";
    } else if (name === "scratchMem6") {
        return "16";
    } else {
        return "mem[" + name + "]";
    }
}

function decrementSP(number) {
    if (number === 0) {
        return;
    } else {
        //listOfCodes.push({comment: "// Decrease SP by " + number});
        emit("ADD", getMemoryAdress("stackPointer"), getMemoryAdress("negativeOne"), "");
        listOfCodes[1].value -= 1;
        decrementSP(number - 1);
    }
}

function pop(destination) {
    let comment = "// Pop to " + destination;
    listOfCodes.push({comment: comment});
    decrementSP(1);
    emit("CPI", getMemoryAdress(destination), getMemoryAdress("stackPointer"), "");
}

function incrementSP(number) {
    emit("ADDi", getMemoryAdress("stackPointer"), number + "", "");
    listOfCodes[1].value += 1;
}

function push(source) {
    let comment = "// Push " + source;
    emit("CPIi", getMemoryAdress("stackPointer"), getMemoryAdress(source), comment);
    incrementSP(1);
}

// function initializeListOfCodes() {
//     listOfCodes.push({type: "inst", location: 0,  opCode: "BZJi", opA : "3", opB: "17", comment: ""});
//     for (let i = 1; i < 17; i++) {
//         var comment =
//     }
// }

var listOfCodes = [{type: "inst", location: 0, opCode: "BZJi", opA: "3", opB: "17", comment: ""},
    {type: "data", location: 1, value: 0, comment: "//&($topofstack)"},
    {type: "data", location: 2, value: 0, comment: "//&($topofstack)"},
    {type: "data", location: 3, value: 0, comment: "//zero"},
    {type: "data", location: 4, value: 4294967295, comment: "//negativeOne"},
    {type: "data", location: 5, value: 0, comment: "//VSCPU-5"},
    {type: "data", location: 6, value: 0, comment: "//VSCPU-6"},
    {type: "data", location: 7, value: 0, comment: "//VSCPU-7"},
    {type: "data", location: 8, value: 0, comment: "//VSCPU-8"},
    {type: "data", location: 9, value: 0, comment: "//VSCPU-9"},
    {type: "data", location: 10, value: 0, comment: "//VSCPU-10"},
    {type: "data", location: 11, value: 0, comment: "//scratchMem1"},
    {type: "data", location: 12, value: 0, comment: "//scratchMem2"},
    {type: "data", location: 13, value: 0, comment: "//scratchMem3"},
    {type: "data", location: 14, value: 0, comment: "//scratchMem4"},
    {type: "data", location: 15, value: 0, comment: "//scratchMem5"},
    {type: "data", location: 16, value: 0, comment: "//scratchMem6"},
    {type: "inst", location: 17, opCode: "CPi", opA: "11", opB: "24", comment: "// $globalinit:  //17 \n// Calling main, numArgs: 0"},
    {type: "inst", location: 18, opCode: "CPIi", opA: "1", opB: "11", comment: "// Push scratchMem1"},
    {type: "inst", location: 19, opCode: "ADDi", opA: "1", opB: "1", comment: ""},
    {type: "inst", location: 20, opCode: "CPIi", opA: "1", opB: "2", comment: "// Push basePointer"},
    {type: "inst", location: 21, opCode: "ADDi", opA: "1", opB: "1", comment: ""},
    {type: "inst", location: 22, opCode: "CP", opA: "2", opB: "1", comment: "// Evaluating args.\n// Args evaluated.\n// Adjust BP to (SP - 0)"},
    {type: "inst", location: 23, opCode: "BZJi", opA: "3", opB: "27", comment: ""},
    {type: "inst", location: 24, opCode: "ADD", opA: "1", opB: "4", comment: "// $L2:  //24\n// Pop to scratchMem1"},
    {type: "inst", location: 25, opCode: "CPI", opA: "11", opB: "1", comment: ""},
    {type: "data", location: 26, value: 0, comment: "//HALT"}
];

function modifyTopOfStack() {
    // listOfCodes[1].value = listOfCodes[listOfCodes.length - 1].location + 1;
    // listOfCodes[2].value = listOfCodes[listOfCodes.length - 1].location + 1 ;
    listOfCodes[1].value = getNextLocation();
    listOfCodes[2].value = getNextLocation();
}

// function decreaseSP(){
//     var hashTable = hashList.getHead();
//     if(hashTable !== null) {
//         for(let i = 0; i<hashTable.length; i++){
//             if(i==0){
//                 let comment = "// Decrease SP by " + hashTable.length;
//                 listOfCodes.push({type: "inst", location: listOfCodes.length, opCode: "ADD", opA: "1", opB: "4", comment: comment});
//             }else{
//                 listOfCodes.push({type: "inst", location: listOfCodes.length, opCode: "ADD", opA: "1", opB: "4", comment: ""});
//             }
//
//         }
//     }
// }

function printListOfCodes() {
    for (let i = 0; i < listOfCodes.length; i++) {
        if (listOfCodes[i].type === "inst") {
            if (listOfCodes[i].comment.length > 0) console.log(listOfCodes[i].comment);
            console.log(listOfCodes[i].location + ": " + listOfCodes[i].opCode + " " + listOfCodes[i].opA + " " + listOfCodes[i].opB);
        } else if (listOfCodes[i].type === "data") {
            console.log(listOfCodes[i].location + ": " + listOfCodes[i].value + " " + listOfCodes[i].comment);
        } else{
            console.log(listOfCodes[i].comment);
        }
    }
}

function addVarDeclarationToListOfCodes(variable) {
    var hashTable = hashList.getHead();
    var comment = "";
    if(doesValueExist(variable)) {
        comment = "// Initialization of var '" + variable.name + "'";
        listOfCodes.push({comment : comment});
        declarationOrStatement(variable.value);

    }else {
        comment = "// Allocate var '" + variable.name + "'";
        listOfCodes.push({comment : comment});
        incrementSP(1);

    }


}

function getNextLocation(){
    let loc;
    for(let i = listOfCodes.length -1; i>0; i--){
        if(typeof listOfCodes[i].location !== 'undefined'){
            loc = listOfCodes[i].location + 1;
            break;
        }
    }
    return loc;
}

    /*
    let comment = "";
    let name = variable.name;
    if (listOfCodes.length === 27) {
        comment = "// $L1main:  //27\n// Entering a block.\n"
    }
    if (typeof variable.value !== 'undefined') {
        if (typeof variable.value.value !== 'undefined') {
            let value = variable.value.value;
            comment += "// Initialization of var '" + name + "'\n// Const. int " + value;
            listOfCodes.push({type: "inst", location: listOfCodes.length, opCode: "CPi", opA: "11", opB: value, comment: comment});
            listOfCodes.push({type: "inst", location: listOfCodes.length, opCode: "CPIi", opA: listOfCodes[1].location, opB: "11", comment: "// Push scratchMem1"});
            listOfCodes.push({type: "inst", location: listOfCodes.length, opCode: "ADDi", opA: listOfCodes[1].location, opB: "1", comment: ""});
            listOfCodes[1].value += 1;
        } else {
            decideExpression(variable.value);
        }
    } else {
        comment += "// Allocate var '" + name + "'";
        listOfCodes.push({type: "inst", location: listOfCodes.length, opCode: "ADDi", opA: "1", opB: "1", comment: comment});
    }
    */




//----------------------- MAIN ---------------------------------
for (let i = 0; i < myJSon.length; i++) {

    decideDeclaration(myJSon[i]);
    if(hashList.getHead() !== null) {
        let comment = hashList.getHead().length;
        listOfCodes.push({comment: "// Decrease SP by " + comment});
        decrementSP(hashList.getHead().length); //TODO
    } else {
        listOfCodes.push({comment: "// Decrease SP by 0" });
    }
}

function decideDeclaration(JSonObject) {
    var declaration = JSonObject.type;

    switch (declaration) {
        case("FunctionDeclaration"):
            listOfCodes.push({comment: "// $L" + functionCount + JSonObject.name + ":  //"+ getNextLocation()});
            listOfCodes.push({comment: "// Entering a block."});
            functionCount ++;
            for (let i = 0; i < JSonObject.body.length; i++) {
                declarationOrStatement(JSonObject.body[i]);
            }

        case("GlobalVariableDeclaration"):
        //var name = JSonObject.name;
        //var value = declarationOrStatement(JSonObject)
        //addToEnvironment(name);
    }
}


function declarationOrStatement(JSonBody) {
    if (JSonBody.type === "VariableDeclaration") {
        var name = JSonBody.name;
        addToEnvironment(name);
        addVarDeclarationToListOfCodes(JSonBody);
        return;
    } else {
        decideStatement(JSonBody);
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
            let value = null;
            if(typeof JSonBody.value !== 'undefined') {
                value = JSonBody.value;
                listOfCodes.push({comment: "// Return (Some)"});
                declarationOrStatement(value);
                pop("scratchMem1");;
            } else {
                listOfCodes.push({comment: "// Return (None)"});
            }
            emit("CP", getMemoryAdress("stackPointer"), getMemoryAdress("basePointer"), "");
            pop("basePointer");
            pop("scratchMem2");
            push("scratchMem1");
            emit("BZJi", getMemoryAdress("scratchMem2"), "0", "");
            listOfCodes.push({comment: "// Return op end."});
            return;
        default:
            decideExpression(JSonBody);
    }
}


function decideExpression(expression) {
    var expressionType = expression.type;
    let comment = "";
    let value = null;
    switch (expressionType) {
        case ("Literal"):
            value = expression.value;
            comment = "// Const. int " + value + "";
            emit("CPi", getMemoryAdress("scratchMem1"), "" + value + "", comment);
            push("scratchMem1");
            return value;
        case ("Identifier"):
            value = expression.value;
            declarationOrStatement(value);
            lookupVar = value; //doğru olmayabilir
            return value;
        case ("BinaryExpression"):
            doBinaryExpression(expression);
            break;
        case ("PrefixExpression"):
            var operator = expression.operator;
            value = decideExpression(expression.value);
        case ("SuffixExpression"):
            var operator = expression.operator;
            value = decideExpression(expression.value);
        case ("CastExpression"):
            value = decideExpression(expr.value);
        case ("CallExpression"):
            let hashTable = new HashTable({});
            hashList.unshift(hashTable);
            var arguments = expr.arguments;
            for (let i = 0; i < arguments.length; i++) {
                var argument = decideExpression(arguments[i]);
            }
        case ("IndexExpression"):
            value = decideExpression(expr.value);
            var index = decideExpression(expr.index);
    }
}

function access(value) {
    let loc = lookup(value);
    comment = "// Local var '" + value + "' @ " + loc;
    listOfCodes.push({comment: comment});
    emit("CP", getMemoryAdress("scratchMem1"), getMemoryAdress("basePointer"), "");
    emit("ADDi", getMemoryAdress("scratchMem1"), loc, "");
    push("scratchMem1");
}

function doesElseExist(JSonBody) {
    return typeof JSonBody.else !== 'undefined';
}

function doesValueExist(JSonBody) {
    return typeof JSonBody.value !== 'undefined';
}


function doAssignment(expression) {

    let comment = "// Assignment";
    listOfCodes.push({comment: comment});
    declarationOrStatement(expression.left);  //let leftValue = declarationOrStatement(expression.left) --> access(leftValue);

    // var opB = listOfCodes[1].value + lookup(leftValue);
    // console.log(opB)
    declarationOrStatement(expression.right);
    access(lookupVar);
    pop("scratchMem1");
    pop("scratchMem2");
    incrementSP(1);
    emit("CPIi", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
}

function doBinaryExpression(expression) {
    var operator = expression.operator;
    if(operator === "=") {
        doAssignment(expression);
        emit("ADD", getMemoryAdress("stackPointer"), getMemoryAdress("negativeOne"), "");
        return;
    }
    let comment1 = "// Binary operation operand1";
    let comment2 = "// Binary operation operand2";
    let comment = "";
    listOfCodes.push({comment: comment1});
    var leftValue = declarationOrStatement(expression.left);
    listOfCodes.push({comment: comment2});
    var rightValue = declarationOrStatement(expression.right);
    pop("scratchMem2");
    pop("scratchMem1");
    switch (operator) {
        case("+"):
            emit("ADD", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            break;
        case("-"):
            comment = "// Subtraction: 3 insts";
            emit("NAND", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), comment);
            emit("ADDi", getMemoryAdress("scratchMem2"), "1", "");
            emit("ADD", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            break;
        case("/"):
            //TODO
        case("*"):
            emit("MUL", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            break;
        case("&&"):

        case("||"):

        case("&"):
            comment = "// &: 2 insts";
            emit("NAND", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), comment);
            emit("NAND", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem1"), "");
            break;
        case("|"):
            comment = "// |: 3 insts";
            emit("NAND", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem1"), comment);
            emit("NAND", getMemoryAdress("scratchMem2"), getMemoryAdress("scratchMem2"), "");
            emit("NAND", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            break;
        case("<"):
            emit("LT", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            break;
        case("<="):
            comment = "// <=: 2 insts";
            emit("ADDi", getMemoryAdress("scratchMem2"), "1", comment);
            emit("LT", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            break;
        case(">"):
            comment = "// >: 2 insts";
            emit("LT", getMemoryAdress("scratchMem2"), getMemoryAdress("scratchMem1"), comment);
            emit("CP", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            break;
        case(">="):
            comment = "// >=: 3 insts";
            emit("ADDi", getMemoryAdress("scratchMem2"), "1", comment);
            emit("LT", getMemoryAdress("scratchMem2"), getMemoryAdress("scratchMem1"), "");
            emit("CP", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            break;
        case("!="):
            comment = "// !=: 5 insts";
            emit("NAND", getMemoryAdress("scratchMem2"), getMemoryAdress("scratchMem2"), comment);
            emit("ADDi", getMemoryAdress("scratchMem2"), "1", "");
            emit("ADD", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            emit("LTi", getMemoryAdress("scratchMem1"), "1", "");
            emit("ADD", getMemoryAdress("scratchMem1"), getMemoryAdress("negativeOne"), "");
            break;
        case("=="):
            comment = "// ==: 4 insts";
            emit("NAND", getMemoryAdress("scratchMem2"), getMemoryAdress("scratchMem2"), comment);
            emit("ADDi", getMemoryAdress("scratchMem2"), "1", "");
            emit("ADD", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"), "");
            emit("LTi", getMemoryAdress("scratchMem1"), "1", "");
            break;
        case("%"):
            //TODO
        case(">>"):
            //TODO
        case("<<"):
            //TODO

    }

    push("scratchMem1");

}


function emit(opCode, opA, opB, comment) {
    listOfCodes.push({type: "inst", location: getNextLocation(), opCode: opCode, opA: opA, opB: opB, comment: comment});
}

function doSuffixExpression(operator, value) {
    //prefix?? --> herşey oluyo
    switch (operator) {
        case("++"):

        case("--"):

    }
}

function decideInstruction(instr) {

}

//Values are adding to the Hash Table
function addToEnvironment(key) {
    if (hashList.length > 0) {
        hashTable = hashList.getHead();
    } else {
        var hashTable = new HashTable({});
        hashList.add(hashTable);
    }
    hashTable.setItem(key, hashTable.getNextIndex());
    hashTable.nextIndex += 1;
}

function lookup(key) {
    var hashTable = hashList.getHead();
    while (hashTable !== null) {
        if (hashTable.hasItem(key)) {
            return hashTable.getItem(key);
        }
        hashTable = hashList.getNext();
    }
    return null;
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


//decreaseSP();
modifyTopOfStack();
printListOfCodes();
printTopOfStack();


function printTopOfStack() {
    console.log("// $topofstack:  //" + listOfCodes[1].value);
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
        } else {
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






