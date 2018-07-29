//----------------------- Linked List ---------------------------------
function Node(data) {
    this.data = data;
    this.next = null;
}

function LinkedList() {
    this.head = null;
    this.length = 0;
}

// /**
//  * @return {number}
//  */
// function Label() {
//     labelEnvironment.add(lastLabel);
//     lastLabel++;
//     return lastLabel;
// }
//
// Label.prototype.update = function(labelIndex, address) {
//     labelEnvironment.setItem(labelIndex, address);
// };
//
// Label.prototype.getLabel = function (labelIndex) {
//    return labelEnvironment.getItem(labelIndex);
// };

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

var compiler = (function () {

    return function (ast) {
        var hashList = new LinkedList();

        var isAssignment = false;
        var isPrefixExpression = false;
        var isReturnStatement = false;
        var returnMain = true;

        var labelCount = 0;
        var globalVariableAddress = 17;
        var globalVariableList = [];

        var returnMainAddress;
        var mainBeginning;

        var globalVariableEnvironment = new HashTable({});
        var labelEnvironment = new HashTable({});
        var lastLabel = 1;

        var functionEnvironment = new HashTable({});
        var functionCallAddress = null;
        var functionLocationList = [];
        var undefinedFunctionList = [];

        var loopBeginning;
        var loopEnd;

        var globalLiteral;
        var globalIdentifier;

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
            {type: "inst", location: null, opCode: "CPi", opA: "11", opB: "24", comment: ""},
            {comment: "// Push scratchMem1"},
            {type: "inst", location: null, opCode: "CPIi", opA: "1", opB: "11", comment: ""},
            {type: "inst", location: null, opCode: "ADDi", opA: "1", opB: "1", comment: ""},
            {comment: "// Push basePointer"},
            {type: "inst", location: null, opCode: "CPIi", opA: "1", opB: "2", comment: ""},
            {type: "inst", location: null, opCode: "ADDi", opA: "1", opB: "1", comment: ""},
            {comment: "// Evaluating args.\n// Args evaluated.\n// Adjust BP to (SP - 0)"},
            {type: "inst", location: null, opCode: "CP", opA: "2", opB: "1", comment: ""},
            {type: "inst", location: null, opCode: "BZJi", opA: "3", opB: "27", comment: ""},
            {comment: null},
            {type: "inst", location: null, opCode: "ADD", opA: "1", opB: "4", comment: ""},
            {type: "inst", location: null, opCode: "CPI", opA: "11", opB: "1", comment: ""},
            {type: "inst", location: null, opCode: "BZJi", opA: "3", opB: "26", comment: "// $HALT:  //"}];


        //----------------------- MAIN ---------------------------------
        var assemblyCode = "";
        var myJSon = JSON.parse(ast);
        listOfCodes = listOfCodes.concat(baseList);
        fixLocations();
        hashList.add(globalVariableEnvironment);
        for (let i = 0; i < myJSon.length; i++) {
            decideDeclaration(myJSon[i]);
            if(myJSon[i].type !== "GlobalVariableDeclaration"){
                if(hashList.length > 1 && checkIfNumberOfArgs(myJSon[i])) {
                    let comment = hashList.getHead().length - myJSon[i].arguments.length;
                    emitComment("// Decrease SP by " + comment);
                    decrementSP(hashList.getHead().length - myJSon[i].arguments.length);
                } else {
                    emitComment("// Decrease SP by 0");
                }
            }
        }

        function checkIfNumberOfArgs(myJSon){
            return hashList.getHead().length !== myJSon.arguments.length;
        }

        listOfCodes.splice.apply(listOfCodes, [17 + (globalVariableList.length), 0].concat({comment: "// $globalinit:  //" + (globalVariableList.length + 17)}));
        fixLocations();
        modifyFirstJump();
        modifyMainReturn();
//modifyFunctionLabelLocations();
        modifyTopOfStack();
        stringifyListOfCodes();
        printTopOfStack();
        return assemblyCode;

        function modifyFirstJump(){
            listOfCodes[0].opB = 17 + globalVariableList.length;
        }

        function modifyMainReturn(){
            listOfCodes[returnMainAddress - 12].opB = listOfCodes[returnMainAddress - 1].location;
            listOfCodes[returnMainAddress - 2].comment = "// $L" + getAndIncreaseLabelCount() + ":  //" + listOfCodes[returnMainAddress - 1].location + "\n// Pop to scratchMem1";
            listOfCodes[returnMainAddress - 3].opB = mainBeginning;
            listOfCodes[returnMainAddress+1].opB = listOfCodes[returnMainAddress+1].location;
            listOfCodes[returnMainAddress+1].comment = listOfCodes[returnMainAddress+1].comment + listOfCodes[returnMainAddress+1].location;

        }



        function isFunctionCalled(functionName) {
            for(let i = 0; i < undefinedFunctionList.length; i++) {
                if(undefinedFunctionList[i].name = functionName) {
                    return true;
                }
            }
            return false;
        }

        function modifyFunctionCallAddress(location) {
            for(let i = 0; i < listOfCodes.length; i++) {
                if(typeof listOfCodes[i].type !== 'undefined') {
                    if(listOfCodes[i].location === location) {
                        listOfCodes[i].opB = getNextLocation();
                    }

                }
            }
        }

        function decideDeclaration(JSonObject) {
            let declaration = JSonObject.type;

            switch (declaration) {
                case("FunctionDeclaration"):
                    let functionName = JSonObject.name;
                    if(returnMain === true){
                        listOfCodes = listOfCodes.concat(mainReturn);
                        fixLocations();
                        returnMainAddress = listOfCodes.length - 1;
                        returnMain = false;
                    }

                    if(isFunctionCalled(functionName)) {
                        let loc = findLocation(functionName, undefinedFunctionList);
                        modifyFunctionCallAddress(loc);
                    }
                    /*
                                if(functionCallAddress === "undefined") {
                                    listOfCodes[functionCallAddress].opB = getNextLocation();
                                    functionCallAddress = null;
                                }
                    */
                    if(JSonObject.name === "main"){
                        mainBeginning = getNextLocation();
                    }
                    let hashTable = new HashTable({});
                    hashList.add(hashTable);
                    for(let k = 0; k < JSonObject.arguments.length; k++) {
                        addToEnvironment(JSonObject.arguments[k].name);
                    }
                    emitComment("// $L" + getAndIncreaseLabelCount() + JSonObject.name + ":  //" + getNextLocation());
                    functionLocationList.push({name: JSonObject.name, location: getNextLocation()});
                    emitComment("// Entering a block.");
                    for (let i = 0; i < JSonObject.body.length; i++) {
                        declarationOrStatement(JSonObject.body[i]);
                    }
                    if(isReturnStatement === false && JSonObject.defType.name === "void"){
                        doReturnNone();
                    }
                    return;
                case("GlobalVariableDeclaration"):
                    if(checkIfPointerType(JSonObject)) {
                        addGlobalArrayDeclarationToListOfCodes(JSonObject);
                        return;
                    }
                    globalVariableEnvironment.setItem(JSonObject.name, globalVariableEnvironment.getNextIndex());

                    let tempGlobVarList = globalVariableList.slice(); //Yp

                    globalVariableList.push({type: "data", location: getNextLocation(), value: 0, comment: "//GLOBAL: " + JSonObject.name});

                    var dif = globalVariableList.diff(tempGlobVarList);
                    listOfCodes.splice.apply(listOfCodes, [17 + (globalVariableList.length - 1), 0].concat(dif));


                    if(doesValueExist(JSonObject)){
                        decideStatement(JSonObject.value);
                        pop("scratchMem1");
                        emit("CP", globalVariableAddress, getMemoryAddress("scratchMem1"), "");
                    }

                    let tempListOfCodes = listOfCodes.slice();
                    globalVariableAddress++;
                    var difference = listOfCodes.diff(tempListOfCodes);
                    insertGlobalVariableInstructions(difference);
                    fixLocations();
            }
        }

        function addGlobalArrayDeclarationToListOfCodes(JSonObject){
            let tempListOfCodes = listOfCodes.slice();
            for(var i = 0 ; i<JSonObject.defType.length.value; i++){
                globalVariableEnvironment.setItem(JSonObject.name, globalVariableEnvironment.getNextIndex());
                globalVariableList.push({type: "data", location: getNextLocation(), value: 0, comment: "//GLOBAL: " + JSonObject.name + "[" + i + "]"});
            }
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
                if(checkIfPointerType(JSonBody) && checkIfArray(JSonBody)){
                    addArrayDeclarationToListOfCodes(JSonBody);
                    return;
                }
                addToEnvironment(name);
                addVarDeclarationToListOfCodes(JSonBody);
                return;
            } else {
                decideStatement(JSonBody);
            }
        }

        function checkIfPointerType(JSonBody){
            return (JSonBody.defType.type === "PointerType")
        }

        function checkIfArray(JSonBody){
            return typeof JSonBody.defType.length !== 'undefined';
        }

        function addArrayDeclarationToListOfCodes(JSonBody){
            var comment = "// Allocate array " + JSonBody.name + "[" + JSonBody.defType.length.value + "]";
            emitComment(comment);
            for(var i = 0; i<JSonBody.defType.length.value + 1; i++){
                addToEnvironment(JSonBody.name);
            }
            emit("CP", getMemoryAddress("scratchMem1"), getMemoryAddress("stackPointer"), "");
            incrementSP(JSonBody.defType.length.value);
            push("scratchMem1");
            return;
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

        function addToFunEnvironment(funName, argName) {
            let hashTable = functionEnvironment.getItem(funName);
            hashTable.setItem(argName, hashTable.getNextIndex());
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
                    let elseLabelCount = getAndIncreaseLabelCount();
                    let endLabelCount = getAndIncreaseLabelCount();
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
                    decrementSP(1);
                    return;
                case("ForStatement"):
                    let forConditionLabelCount = getAndIncreaseLabelCount(); //TODO will modify
                    let forEndLabelCount = getAndIncreaseLabelCount();       //TODO will modify
                    let forExitLabelCount = getAndIncreaseLabelCount();      //TODO will modify
                    let exitLocation = null;
                    emitComment( "// For loop. Test: $L" + forConditionLabelCount +", End: $L" + forEndLabelCount +  ", Exit: $L" + forExitLabelCount);
                    loopBeginning = getNextLocation();
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
                    emitComment("// $L" + forEndLabelCount + ":  //" + getNextLocation()+"");
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
                    loopBeginning = getNextLocation();
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
                    isReturnStatement = true;
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

        function doReturnNone(){
            emitComment("// Return (None)");
            emit("CP", getMemoryAddress("stackPointer"), getMemoryAddress("basePointer"), "");
            pop("basePointer");
            pop("scratchMem2");
            push("scratchMem1");
            emit("BZJi", getMemoryAddress("scratchMem2"), "0", "");
            emitComment("// Return op end.");
            return;
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

        function decrementBP(number) {
            if(number === 0) {
                return;
            } else {
                emit("ADD", getMemoryAddress("basePointer"), getMemoryAddress("negativeOne"), "");
                listOfCodes[2].value -= 1;
                decrementBP(number - 1);
            }
        }

        function push(source) {
            let comment = "// Push " + source;
            emit("CPIi", getMemoryAddress("stackPointer"), getMemoryAddress(source), comment);
            incrementSP(1);
        }

        function getNumArgs(expression) {
            let numArgs;
            if (expression.arguments[0] === null) {
                numArgs = 0;
            } else if (expression.arguments.length == 1 && expression.arguments[0] !== null) {
                numArgs = 1;
            } else {
                numArgs = expression.arguments.length;
            }
            return numArgs;
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
                    globalLiteral = value;
                    return;
                case ("Identifier"):
                    value = expression.value;
                    if(value === "continue" || value === "break"){
                        doBreakOrContinue(expression);
                        break;
                    }
                    declarationOrStatement(value);
                    if(isAssignment === false) doAccess(value);
                    globalIdentifier = value;
                    return;
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
                    let functionName = expression.base.value;
                    functionEnvironment.setItem(functionName, hashTable);
                    let numArgs = getNumArgs(expression);
                    if(expression.arguments[0] !== null){
                        for(let k = 0; k < numArgs; k++) {
                            addToFunEnvironment(functionName, expression.arguments[k].value);
                        }
                    }
                    let returnLabelCount = getAndIncreaseLabelCount();
                    let arguments = expression.arguments;
                    emitComment("// Calling " + functionName + ", numArgs: " + numArgs);
                    emit("CPi",getMemoryAddress("scratchMem1"), null, "");
                    let returnLocationIndex = listOfCodes.length - 1;
                    push("scratchMem1");
                    push("basePointer");
                    emitComment("// Evaluating args.");
                    for (let i = 0; i < numArgs; i++) {
                        declarationOrStatement(arguments[i]);
                    }
                    emitComment("// Args evaluated.");
                    emitComment("// Adjust BP to (SP - " + numArgs + ")");
                    emit("CP", getMemoryAddress("basePointer"), getMemoryAddress("stackPointer"), "");
                    decrementBP(numArgs);
                    let jumpLocation = findLocation(functionName, functionLocationList);
                    if(jumpLocation === undefined) {
                        undefinedFunctionList.push({name: functionName, location: getNextLocation()});
                    }
                    emit("BZJi", getMemoryAddress("zero"), jumpLocation, ""); //TODO
                    //functionCallAddress = listOfCodes.length - 1;
                    listOfCodes[returnLocationIndex].opB = getNextLocation();
                    emitComment("// $L" + returnLabelCount + ":  //" + getNextLocation()+"");
                    break;
                case ("IndexExpression"):
                    emitComment("// Array indexing -- base");
                    value = expression.value.value;
                    emitComment("// Access");
                    doAccess(value);
                    emitComment("// Array indexing -- index");
                    declarationOrStatement(expression.index);
                    pop("scratchMem1");
                    pop("scratchMem2");
                    emit("ADD", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
                    push("scratchMem1");
                    if(isReturnStatement === true){
                        pop("scratchMem1");
                        emit("CPI", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem1"), "");
                        push("scratchMem2");

                    }
                    break;
            }
        }

        function findLocation(functionName, list){
            let loc;
            for(let i = 0 ; i<list.length; i++){
                if(list[i].name === functionName){
                    loc = list[i].location;
                }
            }
            return loc;
        }

        function doBreakOrContinue(expression){
            var value = expression.value;
            switch(value){
                case ("continue") :
                    emit("BZJi", getMemoryAddress("zero"), loopBeginning, "" );
                    break;
                case("break") :
                    emit("BZJi", getMemoryAddress("zero"), null, "" );
                    break;
            }

        }

        function doBinaryExpression(expression) {
            let operator = expression.operator;
            if(operator === "=") {
                doAssignment(expression);
                emit("ADD", getMemoryAddress("stackPointer"), getMemoryAddress("negativeOne"), "");
                return;
            }else if(operator === "&&" || operator === "||"){
                doLogicalOperation(expression);
                return;
            }else if(operator === ":"){
                doTernary(expression);
                return;
            }
            let comment = "";
            emitComment("// Binary operation operand1");
            declarationOrStatement(expression.left);        //var leftValue =  deleted
            emitComment("// Binary operation operand2");
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
                    emitComment("// Loop for operation: " + operator);
                    let negB1 = getMemoryAddress("scratchMem4"); //(* will store -B in scratchMem4 *)
                    let loopExit1 = null;
                    emit("CPi", getMemoryAddress("scratchMem3"),0,"");
                    emit("CP", negB1, getMemoryAddress("scratchMem2"),"");
                    emit("NAND", negB1,negB1,"");
                    emit("ADDi", negB1,1,"");
                    emit("CPi", getMemoryAddress("scratchMem6"), loopExit1, "");
                    let loopExitLocationIndex1 = listOfCodes.length-1;
                    emit("ADD", getMemoryAddress("scratchMem2"),getMemoryAddress("negativeOne"),"");
                    emitComment("// $L" + getAndIncreaseLabelCount() + ":  //" + getNextLocation());
                    let loopBeginLocationIndex1 = getNextLocation();
                    emit("CP", getMemoryAddress("scratchMem5"),getMemoryAddress("scratchMem2") , "");
                    emit("LT", getMemoryAddress("scratchMem5"),getMemoryAddress("scratchMem1") , "");
                    emit("BZJ", getMemoryAddress("scratchMem6"),getMemoryAddress("scratchMem5") , "");
                    emit("ADD", getMemoryAddress("scratchMem1"),negB1, "");
                    emit("ADDi", getMemoryAddress("scratchMem3"), 1 , "");
                    emit("BZJi", getMemoryAddress("zero"),loopBeginLocationIndex1 , "");
                    emitComment("// $L" + getAndIncreaseLabelCount() + ":  //" + getNextLocation());
                    listOfCodes[loopExitLocationIndex1].opB = getNextLocation();
                    emit("CP", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem3"), "");
                    break;
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
                    emit("ADDi", getMemoryAddress("scratchMem1"), "1", comment);
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
                    emitComment("// Loop for operation: %" );
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
                case("?"):
                    return;
                case("+="):

                    return;
                case("-="):
                    return;
                case("*="):
                    return;
                case("/="):
                    return;
            }
            push("scratchMem1");
        }

        function doTernary(expression){
            let elseLabelCount = getAndIncreaseLabelCount();
            let endLabelCount = getAndIncreaseLabelCount();
            let elseLocation = null;
            let endLocation = null;
            emitComment("// Ternary. Else: $L" + elseLabelCount + ", End: $L" + endLabelCount);
            declarationOrStatement(expression.left.left);
            pop("scratchMem1");
            emit("CPi", getMemoryAddress("scratchMem2"), elseLocation, "");
            let elseLocationIndex = listOfCodes.length - 1;
            emit("BZJ", getMemoryAddress("scratchMem2"),getMemoryAddress("scratchMem1"),"");
            declarationOrStatement(expression.left.right);
            emit("BZJi", getMemoryAddress("zero"), endLocation, "");
            let endLocationIndex = listOfCodes.length - 1;
            emitComment("// $L" + elseLabelCount + ":  //" + getNextLocation() + "");
            listOfCodes[elseLocationIndex].opB = getNextLocation();
            declarationOrStatement(expression.right);
            emitComment("// $L" + endLabelCount + ":  //" + getNextLocation() + "");
            listOfCodes[endLocationIndex].opB = getNextLocation();
        }

        function doAssignment(expression) {
            let comment = "// Assignment";
            emitComment(comment);
            declarationOrStatement(expression.right);
            isAssignment = true;


            if(expression.left.type === "IndexExpression"){
                declarationOrStatement(expression.left);
                pop("scratchMem1");
                pop("scratchMem2");
                incrementSP(1);
                emit("CPIi", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
                isAssignment = false;
                return;
            }

            declarationOrStatement(expression.left);
            let name = globalIdentifier;
            isAssignment = false;


            if(expression.left.operator === "*"){
                doAccess(name);
            }else{
                access(name);
            }
            pop("scratchMem1");
            pop("scratchMem2");
            incrementSP(1);
            emit("CPIi", getMemoryAddress("scratchMem1"), getMemoryAddress("scratchMem2"), "");
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
                    emitComment("// LogicalAnd until label $L" + labEnd );
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
            if(operator === "&"){
                doAddressOperator(expression);
                return;
            }
            if(operator === "*"){
                doDeRefOperator(expression);
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

        function doAddressOperator(expression){
            emitComment("// Address-of");
            declarationOrStatement(expression.value);
            access(expression.value.value);
        }

        function doDeRefOperator(expression){
            emitComment("// Deref.");
            declarationOrStatement(expression.value);
            if(isReturnStatement === true || !isAssignment){        //functionCall6 için yaptım
                pop("scratchMem1");
                emit("CPI", getMemoryAddress("scratchMem2"), getMemoryAddress("scratchMem1"), "");
                push("scratchMem2");
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

        function stringifyListOfCodes() {
            for (let i = 0; i < listOfCodes.length; i++) {
                if (listOfCodes[i].type === "inst") {
                    if (listOfCodes[i].comment.length > 0) {
                        assemblyCode = assemblyCode.concat(listOfCodes[i].comment + "\n");
                    }
                    assemblyCode = assemblyCode.concat(listOfCodes[i].location + ": " + listOfCodes[i].opCode + " " + listOfCodes[i].opA + " " + listOfCodes[i].opB + "\n");
                } else if (listOfCodes[i].type === "data") {
                    assemblyCode = assemblyCode.concat(listOfCodes[i].location + ": " + listOfCodes[i].value + " " + listOfCodes[i].comment + "\n");
                } else {
                    assemblyCode = assemblyCode.concat(listOfCodes[i].comment + "\n");
                }
            }
        }

        function printTopOfStack() {
            assemblyCode = assemblyCode.concat("// $topofstack:  //" + listOfCodes[1].value + "\n");
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
    }
})();

if (typeof module === "object") module.exports = compiler;