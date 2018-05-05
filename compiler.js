var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);
let hashList = new LinkedList();

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
    return this.getNext();
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
        emit("ADD", getMemoryAdress("stackPointer"), getMemoryAdress("negativeOne"), "");
        decrementSP(number - 1);
    }
}

function pop(destination) {
    let comment = "Pop to " + destination;
    decrementSP(1);
    emit("CPI", getMemoryAdress(destination), getMemoryAdress("stackPointer"), comment);
}

function incrementSP(number) {
    emit("ADDi", getMemoryAdress("stackPointer"), number.toString(), "");
}

function push(source) {
    let comment = "Push " + source;
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
    {
        type: "inst",
        location: 17,
        opCode: "CPi",
        opA: "11",
        opB: "24",
        comment: "// $globalinit:  //17 \n// Calling main, numArgs: 0"
    },
    {type: "inst", location: 18, opCode: "CPIi", opA: "1", opB: "11", comment: "// Push scratchMem1"},
    {type: "inst", location: 19, opCode: "ADDi", opA: "1", opB: "1", comment: ""},
    {type: "inst", location: 20, opCode: "CPIi", opA: "1", opB: "2", comment: "// Push basePointer"},
    {type: "inst", location: 21, opCode: "ADDi", opA: "1", opB: "1", comment: ""},
    {
        type: "inst",
        location: 22,
        opCode: "CP",
        opA: "2",
        opB: "1",
        comment: "// Evaluating args.\n// Args evaluated.\n// Adjust BP to (SP - 0)"
    },
    {type: "inst", location: 23, opCode: "BZJi", opA: "3", opB: "27", comment: ""},
    {type: "inst", location: 24, opCode: "ADD", opA: "1", opB: "4", comment: "// $L2:  //24\n// Pop to scratchMem1"},
    {type: "inst", location: 25, opCode: "CPI", opA: "11", opB: "1", comment: ""},
    {type: "data", location: 26, value: 0, comment: "//HALT"}
];

function modifyTopOfStack() {
    listOfCodes[1].value = listOfCodes[listOfCodes.length - 1].location + 1;
    listOfCodes[2].value = listOfCodes[listOfCodes.length - 1].location + 1;
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
        }
    }
}

function addVarDeclarationToListOfCodes(variable) {
    let comment = "";
    let name = variable.name;
    if (listOfCodes.length === 27) {
        comment = "// $L1main:  //27\n// Entering a block.\n"
    }
    if (typeof variable.value !== 'undefined') {
        if (typeof variable.value.value !== 'undefined') {
            let value = variable.value.value;
            comment += "// Initialization of var '" + name + "'\n// Const. int " + value;
            listOfCodes.push({
                type: "inst",
                location: listOfCodes.length,
                opCode: "CPi",
                opA: "11",
                opB: value,
                comment: comment
            });
            listOfCodes.push({
                type: "inst",
                location: listOfCodes.length,
                opCode: "CPIi",
                opA: listOfCodes[1].location,
                opB: "11",
                comment: "// Push scratchMem1"
            });
            listOfCodes.push({
                type: "inst",
                location: listOfCodes.length,
                opCode: "ADDi",
                opA: listOfCodes[1].location,
                opB: "1",
                comment: ""
            });
            listOfCodes[1].value += 1;
        } else {
            decideExpression(variable.value);
        }
    } else {
        comment += "// Allocate var '" + name + "'";
        listOfCodes.push({
            type: "inst",
            location: listOfCodes.length,
            opCode: "ADDi",
            opA: "1",
            opB: "1",
            comment: comment
        });
    }

}


//----------------------- MAIN ---------------------------------
for (let i = 0; i < myJSon.length; i++) {
    decideDeclaration(myJSon[i]);
}
//
// function assignOpCode(instruction) {
//     switch (instruction) {
//         case ("ADD"):
//             return 0;
//         case ("NAND"):
//             return 1;
//         case ("SRL"):
//             return 2;
//         case ("LT"):
//             return 3;
//         case ("CP"):
//             return 4;
//         case ("CPI"):
//             return 5;
//         case ("BZJ"):
//             return 6;
//         case ("MUL"):
//             return 7;
//     }
// }

function decideDeclaration(JSonObject) {
    var declaration = JSonObject.type;

    switch (declaration) {
        case("FunctionDeclaration"):
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
        default:
            decideExpression(JSonBody);
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
            var result = doBinaryExpression(expression);
            return result;
        case ("PrefixExpression"):
            var operator = expression.operator;
            var value = decideExpression(expression.value);
        case ("SuffixExpression"):
            var operator = expression.operator;
            var value = decideExpression(expression.value);
        case ("CastExpression"):
            var value = decideExpression(expr.value);
        case ("CallExpression"):
            let hashTable = new HashTable({});
            hashList.unshift(hashTable);
            var arguments = expr.arguments;
            for (let i = 0; i < arguments.length; i++) {
                var argument = decideExpression(arguments[i]);
            }
        case ("IndexExpression"):
            var value = decideExpression(expr.value);
            var index = decideExpression(expr.index);
    }
}


function doesElseExist(JSonBody) {
    return typeof JSonBody.else !== 'undefined';
}


function doBinaryExpression(expression) {
    var operator = expression.operator;
    let comment1 = "Binary operation operand1\n";
    let comment2 = "Binary operation operand2\n";
    listOfCodes.push({comment: comment1});
    var leftValue = declarationOrStatement(expression.left);
    listOfCodes.push({comment: comment2});
    var rightValue = declarationOrStatement(expression.right);
    pop("scratchMem2");
    pop("scratchMem1");
    switch (operator) {
        case("="):
            var opB = listOfCodes[1].value + lookup(leftValue);
            console.log(opB)
            var comment = "// Assignment\n// Const. int" + rightValue;  //??
            listOfCodes.push({
                type: "inst",
                location: listOfCodes.length,
                opCode: "CPi",
                opA: "11",
                opB: rightValue,
                comment: comment
            });
            listOfCodes.push({
                type: "inst",
                location: listOfCodes.length,
                opCode: "CPIi",
                opA: "1",
                opB: "11",
                comment: "// Push scratchMem1"
            });
            listOfCodes.push({
                type: "inst",
                location: listOfCodes.length,
                opCode: "ADDi",
                opA: "1",
                opB: "1",
                comment: ""
            });
            return;
        case("+"):
            emit("ADD", getMemoryAdress("scratchMem1"), getMemoryAdress("scratchMem2"));
            break;
        case("-"):

        case("/"):

        case("*"):

        case("&&"):

        case("||"):

        case("&"):

        case("|"):

        case("<"):

        case("<="):

        case(">"):

        case(">="):

    }

    push("scratchMem1");

}


function emit(opCode, opA, opB, comment) {
    listOfCodes.push({
        type: "inst",
        location: listOfCodes.length,
        opCode: opCode,
        opA: opA,
        opB: opB,
        comment: comment
    });
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


decreaseSP();
printListOfCodes();
modifyTopOfStack();
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






