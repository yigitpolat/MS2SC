var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);
let hashList = new LinkedList();
var isAssignment = false;
var labelCount = 1;
let isPrefixExpression = false;
var globalVariableAddress = 17;
var globalVariableList = [];
let globalVariableEnvironment = new HashTable({});
var mainReturn = 0;


//----------------------- Linked List ---------------------------------
function Node(data) {
    this.data = data;
    this.next = null;
}

function LinkedList() {
    this.head = null;
    this.length = 0;
}


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
    return nodeToCheck.data;
};

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
    //TODO return headHashList
};

LinkedList.prototype.removeHead = function () {
    if (!this.head) return null;
    var currentNode = this.head;
    this.head = currentNode.next;
    this.length--;
    //DELETE THE PREVIOUS HEAD
};


LinkedList.prototype.getNext = function () {
    var currentNode = this.head;
    return currentNode.next.data;
};

Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) === -1;
    });
};

var baseList = [{type: "inst", location: 0, opCode: "BZJi", opA: "3", opB: "17", comment: ""},
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
                {type: "data", location: 16, value: 0, comment: "//scratchMem6"}];

var listOfCodes = [];

var mainReturn = [  {comment: "// Calling main, numArgs: 0"},
                    {type: "inst", location: 17, opCode: "CPi", opA: "11", opB: "24", comment: ""},
                    {comment: "// Push scratchMem1"},
                    {type: "inst", location: 18, opCode: "CPIi", opA: "1", opB: "11", comment: ""},
                    {type: "inst", location: 19, opCode: "ADDi", opA: "1", opB: "1", comment: ""},
                    {comment: "// Push basePointer"},
                    {type: "inst", location: 20, opCode: "CPIi", opA: "1", opB: "2", comment: ""},
                    {type: "inst", location: 21, opCode: "ADDi", opA: "1", opB: "1", comment: ""},
                    {comment: "// Evaluating args.\n// Args evaluated.\n// Adjust BP to (SP - 0)"},
                    {type: "inst", location: 22, opCode: "CP", opA: "2", opB: "1", comment: ""},
                    {type: "inst", location: 23, opCode: "BZJi", opA: "3", opB: "27", comment: ""},
                    {comment: "// $L2:  //24\n// Pop to scratchMem1"},
                    {type: "inst", location: 24, opCode: "ADD", opA: "1", opB: "4", comment: ""},
                    {type: "inst", location: 25, opCode: "CPI", opA: "11", opB: "1", comment: ""},
                    {type: "data", location: 26, value: 0, comment: "//HALT"}];



//----------------------- MAIN ---------------------------------
listOfCodes = listOfCodes.concat(baseList);
hashList.add(globalVariableEnvironment);
for (let i = 0; i < myJSon.length; i++) {
    decideDeclaration(myJSon[i]);
    if(myJSon[i].type !== "GlobalVariableDeclaration"){
        if(hashList.length > 1) {
            let comment = hashList.getHead().length;
            emitComment("// Decrease SP by " + comment);
            decrementSP(hashList.getHead().length); //TODO
        } else {
            emitComment("// Decrease SP by 0");
        }
    }
}

globalVariableList.push({comment: "// $globalinit:  //"});
listOfCodes.splice.apply(listOfCodes, [17, 0].concat(globalVariableList));
fixLocations();
modifyTopOfStack();
printListOfCodes();
printTopOfStack();

function decideDeclaration(JSonObject) {
    let declaration = JSonObject.type;

    switch (declaration) {
        case("FunctionDeclaration"):
            if(mainReturn === 1){
                listOfCodes = listOfCodes.concat(mainReturn);
                mainReturn = 0;
            }
            let hashTable = new HashTable({});
            hashList.add(hashTable);
            emitComment("// $L" + labelCount + JSonObject.name + ":  //"+ getNextLocation());
            emitComment("// Entering a block.");
            labelCount ++;
            for (let i = 0; i < JSonObject.body.length; i++) {
                declarationOrStatement(JSonObject.body[i]);
            }
            return;
        case("GlobalVariableDeclaration"):
            let tempListOfCodes = listOfCodes.slice();
            globalVariableEnvironment.setItem(JSonObject.name, globalVariableEnvironment.getNextIndex());
            globalVariableList.push({type: "data", location: getNextLocation(), value: 0, comment: "//GLOBAL: " + JSonObject.name});
            if(doesValueExist(JSonObject)){
                decideStatement(JSonObject.value);
                pop("scratchMem1");
                emit("CP", globalVariableAddress, getMemoryAddress("scratchMem1"), "");
            }
            globalVariableAddress++;
            var difference = listOfCodes.diff(tempListOfCodes);
            insertGlobalVariableInstructions(difference);
    }
}

function insertGlobalVariableInstructions(difference){
    var index = 17;
    var count = checkDifferenceLength(difference);
    index = index + count;
    listOfCodes.splice.apply(listOfCodes, [index, 0].concat(difference));
    listOfCodes.splice(listOfCodes.length - difference.length , difference.length);
    fixLocations();
}

function checkDifferenceLength(difference){
    var count = 0;
    for(var i = 0 ; i<difference.length; i++){
        if(typeof listOfCodes[i].type !== 'undefined');
        count++;
    }
    return count;
}


function fixLocations(){
    let i = 0;
    let previous = i;
    while(i<listOfCodes.length){
        if(typeof listOfCodes[i].type !== 'undefined'){
            listOfCodes[i].location = previous;
            previous++;
            i++;
        } else {
            i++;
        }
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

function addVarDeclarationToListOfCodes(variable) {
    var hashTable = hashList.getHead();
    var comment = "";
    if(doesValueExist(variable)) {
        comment = "// Initialization of var '" + variable.name + "'";
        emitComment(comment);
        declarationOrStatement(variable.value);

    }else {
        comment = "// Allocate var '" + variable.name + "'";
        emitComment(comment);
        incrementSP(1);
    }
}

function doesValueExist(JSonBody) {
    return typeof JSonBody.value !== 'undefined';
}

function incrementSP(number) {
    emit("ADDi", getMemoryAddress("stackPointer"), number + "", "");
    listOfCodes[1].value += 1;
}

function emit(opCode, opA, opB, comment) {
    listOfCodes.push({type: "inst", location: getNextLocation(), opCode: opCode, opA: opA, opB: opB, comment: comment});
}

function emitComment(comment) {
    listOfCodes.push({comment: comment});
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

function getMemoryAddress(name) {
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

function decideStatement(JSonBody) {
    decideDeclaration(JSonBody);
    let currentStatement = JSonBody.type;
    let hashTable;
    switch (currentStatement) {
        case("IfStatement"):
            let conditionType = JSonBody.condition;
            let elseLabelCount = getAndIncreaseLabelCount(); //TODO will modify
            let endLabelCount = getAndIncreaseLabelCount();  //TODO will modify
            let elseLocation = null;
            let endLocation = null;
            let comment = "// If stmt. Else: $L" + elseLabelCount + ", End: $L" + endLabelCount;
            emitComment(comment);
            decideExpression(conditionType);
            pop("scratchMem1");
            emit("CPi", getMemoryAddress("scratchMem2"), elseLocation, "");
            let elseLocationIndex = listOfCodes.length - 1;
            emit("BZJ", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem1"), "");
            hashTable = new HashTable({});
            emitComment("// Entering a block.");
            hashList.add(hashTable);
            for (let i = 0; i < JSonBody.body.length; i++) {
                let thenStatement = JSonBody.body[i];
                declarationOrStatement(thenStatement);
            }
            let number = hashList.getHead().length;
            emitComment("// Decrease SP by " + number);
            hashList.removeHead();
            decrementSP(number);
            emit("BZJi", getMemoryAddress("zero"), endLocation, "");
            let endLocationIndex = listOfCodes.length - 1;
            emitComment("// $L" + elseLabelCount + "  //" + getNextLocation() + "");
            listOfCodes[elseLocationIndex].opB = getNextLocation();
            let elseLocationAddress = listOfCodes.length - 1;
            emitComment("// Entering a block.");
            hashTable = new HashTable({});
            hashList.add(hashTable);
            if (doesElseExist(JSonBody) === true) {
                listOfCodes[elseLocationAddress].opB = listOfCodes.length - 1;
                for (let j = 0; j < JSonBody.else.length; j++) {
                    let elseStatement = JSonBody.else[j];
                    declarationOrStatement(elseStatement);
                }
            }
            let number2 = hashList.getHead().length;
            emitComment("// Decrease SP by " + number2);
            decrementSP(number2);
            hashList.removeHead();
            emitComment("// $L" + elseLabelCount + "  //" + getNextLocation() + "");
            listOfCodes[endLocationIndex].opB = getNextLocation();
            return;
        case("ExpressionStatement"):
            decideExpression(JSonBody.expression);
            return;
        case("ForStatement"):
            let forConditionLabelCount = getAndIncreaseLabelCount(); //TODO will modify
            let forEndLabelCount = getAndIncreaseLabelCount();       //TODO will modify
            let forExitLabelCount = getAndIncreaseLabelCount();      //TODO will modify
            let exitLocation = null;
            emitComment( "// For loop. Test: $L" + forConditionLabelCount +", End: $L" + forEndLabelCount +  ", Exit: $L" + forExitLabelCount);
            var init = JSonBody.init;
            declarationOrStatement(init);
            emitComment("// $L" + forConditionLabelCount + ": //" + getNextLocation()+"");
            let conditionalLocationIndex = getNextLocation();
            var condition = JSonBody.condition;
            decideExpression(condition);
            pop("scratchMem1");
            emit("CPi", getMemoryAddress("scratchMem2"), exitLocation, "");
            let exitLocationIndex = listOfCodes.length - 1;
            emit("BZJ", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem1"), "");
            emitComment("// Entering a block.");
            hashTable = new HashTable({});
            hashList.add(hashTable);
            for (let i = 0; i < JSonBody.body.length; i++) {
                var bodyElement = JSonBody.body[i];
                declarationOrStatement(bodyElement);

            }
            let number3 = hashList.getHead().length;
            emitComment("// Decrease SP by " + number3);
            decrementSP(number3);
            emitComment("// $L:" + forEndLabelCount + "  //" + getNextLocation()+"");
            var step = JSonBody.step;
            decideExpression(step);
            hashList.removeHead();
            emit("BZJi", getMemoryAddress("zero"), conditionalLocationIndex, "");
            emitComment("// $L" + forExitLabelCount + "  //" + getNextLocation()+"");
            listOfCodes[exitLocationIndex].opB = getNextLocation();
            return;
        case("WhileStatement"):
            let whileTestLabelCount = getAndIncreaseLabelCount();  //TODO will modify
            let whileExitLabelCount = getAndIncreaseLabelCount();  //TODO will modify
            let testLocation = null;
            let whileExitLocation = null;
            emitComment("While loop. Test: $L" + whileTestLabelCount + ", Exit: $L" + whileExitLabelCount);
            emitComment("// $L" + whileTestLabelCount + "  //" + getNextLocation() + "");
            let whileTestLocationIndex = getNextLocation();
            condition = JSonBody.condition;
            decideExpression(condition);
            pop("scratchMem1");
            emit("CPi", getMemoryAddress("scratchMem2"), whileExitLocation, "");
            let whileExitLocationIndex = listOfCodes.length -1;
            emit("BZJ", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem1"), "");
            emitComment("// Entering a block.");
            hashTable = new HashTable({});
            hashList.add(hashTable);
            for (let i = 0; i < JSonBody.body.length; i++) {
                let bodyElement = JSonBody.body[i];
                declarationOrStatement(bodyElement);
            }
            let number5 = hashList.getHead().length;
            emitComment("// Decrease SP by " + number5);
            decrementSP(number5);
            hashList.removeHead();
            emit("BZJi", getMemoryAddress("zero"), whileTestLocationIndex, "");
            emitComment("// $L" + whileExitLabelCount + "  //" + getNextLocation()+"");
            listOfCodes[whileExitLocationIndex].opB = getNextLocation();
            return;
        case("ReturnStatement"):
            let value = null;
            if(typeof JSonBody.value !== 'undefined') {
                value = JSonBody.value;
                emitComment("// Return (Some)");
                declarationOrStatement(value);
                pop("scratchMem1");
            } else {
                emitComment("// Return (None)");
            }
            emit("CP", getMemoryAddress("stackPointer"), getMemoryAddress("basePointer"), "");
            pop("basePointer");
            pop("scratchMem2");
            push("scratchMem1");
            emit("BZJi", getMemoryAddress("scratchMem2"), "0", "");
            emitComment("// Return op end.");
            return;
        default:
            decideExpression(JSonBody);
    }
}

function doesElseExist(JSonBody) {
    return typeof JSonBody.else !== 'undefined';
}

function pop(destination) {
    let comment = "// Pop to " + destination;
    emitComment(comment);
    decrementSP(1);
    emit("CPI", getMemoryAddress(destination), getMemoryAddress("stackPointer"), "");
}

function decrementSP(number) {
    if (number === 0) {
        return;
    } else {
        //listOfCodes.push({comment: "// Decrease SP by " + number});
        emit("ADD", getMemoryAddress("stackPointer"), getMemoryAddress("negativeOne"), "");
        listOfCodes[1].value -= 1;
        decrementSP(number - 1);
    }
}

function push(source) {
    let comment = "// Push " + source;
    emit("CPIi", getMemoryAddress("stackPointer"), getMemoryAddress(source), comment);
    incrementSP(1);
}

function decideExpression(expression) {
    let expressionType = expression.type;
    let comment = "";
    let value = null;
    switch (expressionType) {
        case ("Literal"):
            value = expression.value;
            comment = "// Const. int " + value + "";
            emit("CPi", getMemoryAddress("scratchMem1"), "" + value + "", comment);
            push("scratchMem1");
            return value;
        case ("Identifier"):
            value = expression.value;
            declarationOrStatement(value);
            //lookupVar = value; //doğru olmayabilir TODO hatalı değer loop1.c için
            if(isAssignment === false) doAccess(value);
            return value;
        case ("BinaryExpression"):
            doBinaryExpression(expression);
            break;
        case ("PrefixExpression"):
            doPrefixExpression(expression);
            break;
        case ("SuffixExpression"):
            doSuffixExpression(expression);
            break;
        case ("CastExpression"):
            value = decideExpression(expression.value);
            break;
        case ("CallExpression"):
            let hashTable = new HashTable({});
            hashList.add(hashTable);
            let returnLabelCount = getAndIncreaseLabelCount();
            let returnLabelLocation = null;
            let numArgs = expression.arguments.length;
            let arguments = expression.arguments;
            comment = "Calling " + expression.name + ", numArgs: " + numArgs;
            emitComment(comment);
            emit("CPi",getMemoryAddress("scratchMem1"), returnLabelLocation, "");
            let returnLocationIndex = listOfCodes.length-1;
            push("scratchMem1");
            push("basePointer");
            comment = "Evaluating args.";
            emitComment(comment);
            for (let i = 0; i < arguments.length; i++) {
                let argument = declarationOrStatement(arguments[i]);
            }
            comment = "Args evaluated.";
            emitComment(comment);
            comment = "Adjust BP to (SP - " + numArgs + ")";
            emitComment(comment);
            emit("CP", getMemoryAddress("basePointer"), getMemoryAddress("stackPointer"), "");
            decreaseBP(numArgs);
            // emit("BZJi", getMemoryAddress("zero"), ) //TODO
            break;
        case ("IndexExpression"):
            value = decideExpression(expression.value);
            var index = decideExpression(expression.index);
            break;
    }
}

function doBinaryExpression(expression) {
    let operator = expression.operator;
    if(operator === "=") {
        doAssignment(expression);
        emit("ADD", getMemoryAddress("stackPointer"), getMemoryAddress("negativeOne"), "");
        return;
    }
    if(operator === "&&" || operator === "||"){
        doLogicalOperation(expression);
        return;
    }
    let comment1 = "// Binary operation operand1";
    let comment2 = "// Binary operation operand2";
    let comment = "";
    emitComment(comment1);
    declarationOrStatement(expression.left);        //var leftValue =  deleted
    emitComment(comment2);
    declarationOrStatement(expression.right);       //var rightValue = deleted
    pop("scratchMem2");
    pop("scratchMem1");
    switch (operator) {
        case("+"):
            emit("ADD", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
        case("-"):
            comment = "// Subtraction: 3 insts";
            emit("NAND", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem2"), comment);
            emit("ADDi", getMemoryAddress("scratchMem2"), "1", "");
            emit("ADD", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
        case("/"):
        //TODO
        case("*"):
            emit("MUL", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
        case("&"):
            comment = "// &: 2 insts";
            emit("NAND", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), comment);
            emit("NAND", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem1"), "");
            break;
        case("|"):
            comment = "// |: 3 insts";
            emit("NAND", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem1"), comment);
            emit("NAND", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem2"), "");
            emit("NAND", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
        case("<"):
            emit("LT", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
        case("<="):
            comment = "// <=: 2 insts";
            emit("ADDi", getMemoryAddress("scratchMem2"), "1", comment);
            emit("LT", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
        case(">"):
            comment = "// >: 2 insts";
            emit("LT", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem1"), comment);
            emit("CP", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
        case(">="):
            comment = "// >=: 3 insts";
            emit("ADDi", getMemoryAddress("scratchMem2"), "1", comment);
            emit("LT", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem1"), "");
            emit("CP", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
        case("!="):
            comment = "// !=: 5 insts";
            emit("NAND", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem2"), comment);
            emit("ADDi", getMemoryAddress("scratchMem2"), "1", "");
            emit("ADD", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            emit("LTi", getMemoryAddress("scratchMem1"), "1", "");
            emit("ADD", getMemoryAddress("scratchMem1"), getMemoryAddress("negativeOne"), "");
            break;
        case("=="):
            comment = "// ==: 4 insts";
            emit("NAND", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem2"), comment);
            emit("ADDi", getMemoryAddress("scratchMem2"), "1", "");
            emit("ADD", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            emit("LTi", getMemoryAddress("scratchMem1"), "1", "");
            break;
        case("%"):
            emitComment("// Loop for operation: %");
            let negB = getMemoryAddress("scratchMem4"); //(* will store -B in scratchMem4 *)
            let loopExit = null;
            emit("CPi", getMemoryAddress("scratchMem3"),0,"");
            emit("CP", negB, getMemoryAddress("scratchMem2"),"");
            emit("NAND", negB,negB,"");
            emit("ADDi", negB,1,"");
            emit("CPi", getMemoryAddress("scratchMem6"), loopExit, "");
            let loopExitLocationIndex = listOfCodes.length-1;
            emit("ADD", getMemoryAddress("scratchMem2"),getMemoryAddress("negativeOne"),"");
            emitComment("// $L" + getAndIncreaseLabelCount() + ":  //" + getNextLocation());
            let loopBeginLocationIndex = getNextLocation();
            emit("CP", getMemoryAddress("scratchMem5"),getMemoryAddress("scratchMem2") , "");
            emit("LT", getMemoryAddress("scratchMem5"),getMemoryAddress("scratchMem1") , "");
            emit("BZJ", getMemoryAddress("scratchMem6"),getMemoryAddress("scratchMem5") , "");
            emit("ADD", getMemoryAddress("scratchMem1"),negB, "");
            emit("ADDi", getMemoryAddress("scratchMem3"), 1 , "");
            emit("BZJi", getMemoryAddress("zero"),loopBeginLocationIndex , "");
            emitComment("// $L" + getAndIncreaseLabelCount() + ":  //" + getNextLocation());
            listOfCodes[loopExitLocationIndex].opB = getNextLocation();
            break;
        case(">>"):
            let labSkip = null;
            emit("CPi", getMemoryAddress("scratchMem3"), 31, "");
            emit("CPi", getMemoryAddress("scratchMem4"), labSkip, "");
            let labSkipLocationIndex = listOfCodes.length - 1;
            emit("LT", getMemoryAddress("scratchMem3"), getMemoryAddress("scratchMem2"), "");
            emit("BZJ", getMemoryAddress("scratchMem4"), getMemoryAddress("scratchMem3"), "");
            emit("CPi", getMemoryAddress("scratchMem1"), 0, "");
            emitComment("// $L" + getAndIncreaseLabelCount() + ": //" + getNextLocation());
            listOfCodes[labSkipLocationIndex].opB = getNextLocation();
            emit("SRL", getMemoryAddress("scratchMem1"),getMemoryAddress("scratchMem2"),"");
            break;
        case("<<"):
            let labSkip2 = null;
            emit("CPi", getMemoryAddress("scratchMem3"), 31, "");
            emit("CPi", getMemoryAddress("scratchMem4"), labSkip2, "");
            let labSkip2LocationIndex = listOfCodes.length - 1;
            emit("LT", getMemoryAddress("scratchMem3"), getMemoryAddress("scratchMem2"), "");
            emit("BZJ", getMemoryAddress("scratchMem4"), getMemoryAddress("scratchMem3"), "");
            emit("CPi", getMemoryAddress("scratchMem1"), 0, "");
            emitComment("// $L" + getAndIncreaseLabelCount() + ": //" + getNextLocation());
            listOfCodes[labSkip2LocationIndex].opB = getNextLocation();
            emit("CPi", getMemoryAddress("scratchMem3"), 32, "");
            emit("ADD", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem3"), "");
            emit("SRL", getMemoryAddress("scratchMem1"),getMemoryAddress("scratchMem2"),"");
            break;
    }
    push("scratchMem1");
}
function doAssignment(expression) {
    let comment = "// Assignment";
    emitComment(comment);
    isAssignment = true;
    declarationOrStatement(expression.left);
    let name = expression.left.value;
    isAssignment = false;
    declarationOrStatement(expression.right);
    access(name);
    pop("scratchMem1");
    pop("scratchMem2");
    incrementSP(1);
    emit("CPIi", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
    // isAssignment = false;
}

function doAccess(value){
    access(value);
    pop("scratchMem1");
    emit("CPI", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem1"), "");
    if(isPrefixExpression) return;
    push("scratchMem2");

}

function access(value) {
    let loc = lookup(value);
    let comment = "";
    //TODO comment degisecek. fazla access yazıyor. Machine.ml gibi degisitirilcek
    if(isAssignment){
        comment += "// Local var '" + value + "' @ " + loc;  //TODO loop1.c bozuk
    }else{
        comment += "// Access\n// Local var '" + value + "' @ " + loc;
    }
    emitComment(comment);
    emit("CP", getMemoryAddress("scratchMem1"), getMemoryAddress("basePointer"), "");
    emit("ADDi", getMemoryAddress("scratchMem1"), loc, "");
    push("scratchMem1");
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

function doLogicalOperation(expression){
    let operator = expression.operator;
    switch(operator){
        case("&&"):
            var labFalse = null;
            var labEnd = getAndIncreaseLabelCount();
            emitComment("LogicalAnd until label $L" + labEnd );
            decideExpression(expression.left);
            pop("scratchMem2");
            emit("CPi", getMemoryAddress("scratchMem1"), labFalse, "");
            let labFalseLocationIndex = listOfCodes.length - 1;
            emit("BZJ", getMemoryAddress("scratchMem1"),getMemoryAddress("scratchMem2"),"");
            decideExpression(expression.right);
            emit("BZJi", getMemoryAddress("zero"), getNextLocation(), "");
            let labEndLocationIndex = listOfCodes.length-1;
            emitComment("// $L" + labEnd + ":  //" + getNextLocation());
            listOfCodes[labFalseLocationIndex].opB = getNextLocation();
            incrementSP(1);
            emitComment("// $L" + labEnd + ":  //" + getNextLocation());
            listOfCodes[labEndLocationIndex].opB = getNextLocation();
            return;
        case("||"):
            var labFalse2 = null;
            var labEnd2 = getAndIncreaseLabelCount();
            emitComment("// LogicalOr until label $L" + labEnd2 );
            decideExpression(expression.left);
            pop("scratchMem2");
            emit("CPi", getMemoryAddress("scratchMem1"), labFalse2, "");
            let labFalse2LocationIndex = listOfCodes.length - 1;
            emit("BZJ", getMemoryAddress("scratchMem1"),getMemoryAddress("scratchMem2"),"");
            incrementSP(1);
            emit("BZJi", getMemoryAddress("zero"), labFalse2, "");
            let labEnd2LocationIndex = listOfCodes.length-1;
            emitComment("// $L" + labEnd2 + ":  //" + getNextLocation());
            listOfCodes[labFalse2LocationIndex].opB = getNextLocation();
            decideExpression(expression.right);
            emitComment("// $L" + labEnd2 + ":  //" + getNextLocation());
            listOfCodes[labEnd2LocationIndex].opB = getNextLocation();
            return;
    }
}

function doPrefixExpression(expression) {
    let operator = expression.operator;
    if(isUnary(operator)){
        doUnary(expression);
        return;
    }
    emitComment("// PrePost: pre " + operator);
    isPrefixExpression = true;
    declarationOrStatement(expression.value);
    isPrefixExpression = false;
    switch (operator) {
        case("++"):
            emit("ADDi", getMemoryAddress("scratchMem2"), "1", "");
            emit("CPIi", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            push("scratchMem2");
            break;
        case("--"):
            emit("ADD", getMemoryAddress("scratchMem2"), getMemoryAddress("negativeOne"), "");
            emit("CPIi", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            push("scratchMem2");
            break;
    }
}

function isUnary(operator){
    if(operator === "-" || operator === "!" || operator === "~"){
        return true;
    }else{
        return false;
    }
}

function doUnary(expression){
    let operator = expression.operator;
    emitComment("// Unary operation operand");
    declarationOrStatement(expression.value);
    pop("scratchMem1");
    switch (operator) {
        case("!"):
            let labFalseCount = getAndIncreaseLabelCount();
            let labEndCount = getAndIncreaseLabelCount();
            let labFalse = null;
            let labEnd = null;
            emitComment("// LogicalNot until label $L" + labEndCount);
            emit("CPi", getMemoryAddress("scratchMem2"), labFalse, "");
            let labFalseLocationIndex = listOfCodes.length-1;
            emit("BZJ", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem1"), "");
            push("zero");
            emit("BZJi", getMemoryAddress("zero"), labEnd, "");
            let labEndLocationIndex = listOfCodes.length-1;
            emitComment("// $L" + labFalseCount + "  //" + getNextLocation()+"");
            listOfCodes[labFalseLocationIndex].opB = getNextLocation();
            emit("CPi", getMemoryAddress("scratchMem1"), "1", "");
            push("scratchMem1");
            emitComment("// $L" + labEndCount + "  //" + getNextLocation()+"");
            listOfCodes[labEndLocationIndex].opB = getNextLocation();
            break;
        case("-"):
            emit("NAND", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem1"), "");
            emit("ADDi", getMemoryAddress("scratchMem1"), "1", "");
            push("scratchMem1");
            break;
        case("~"):
            emit("NAND", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem1"), "");
            push("scratchMem1");
            break;
    }
}

function getAndIncreaseLabelCount(){
    labelCount++;
    return labelCount;
}


function doSuffixExpression(expression) {
    let operator = expression.operator;
    emitComment("// PrePost: post " + operator);
    declarationOrStatement(expression.value);
    switch (operator) {
        case("++"):
            emit("ADDi", getMemoryAddress("scratchMem2"), "1", "");
            emit("CPIi", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
        case("--"):
            emit("ADD", getMemoryAddress("scratchMem2"), getMemoryAddress("negativeOne"), "");
            emit("CPIi", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
            break;
    }
}

function modifyTopOfStack() {
    listOfCodes[1].value = getNextLocation();
    listOfCodes[2].value = getNextLocation();
}

function printListOfCodes() {
    for (let i = 0; i < listOfCodes.length; i++) {
        if (listOfCodes[i].type === "inst") {
            if (listOfCodes[i].comment.length > 0) console.log(listOfCodes[i].comment);
            console.log(listOfCodes[i].location + ": " + listOfCodes[i].opCode + " " + listOfCodes[i].opA + " " + listOfCodes[i].opB);
        } else if (listOfCodes[i].type === "data") {
            console.log(listOfCodes[i].location + ": " + listOfCodes[i].value + " " + listOfCodes[i].comment);
        } else {
            console.log(listOfCodes[i].comment);
        }
    }
}

function printTopOfStack() {
    console.log("// $topofstack:  //" + listOfCodes[1].value);
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
