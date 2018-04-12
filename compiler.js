var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);
var hashList = {};


for(let i = 0; i < myJSon.length; i++) {               //go over function declarations
    for(let j = 0; j < myJSon[i].body.length; j++){           //go over function body
        if(isStatement(myJSon[i].body[j].type)){         //
            var currentBody = myJSon[i].body[j];
            decideStatement(currentBody);
        }
        //else if(isVariableDeclaration){
        // TODO
        //}
    }
}

function decideStatement(statementBody) {
    let currentStatement = statementBody.type;       //types -> VariableDeclaration // ...Statement
    switch(currentStatement) {
        case("IfStatement"):
            var conditionType = statementBody.condition.type;
            //decideExpression
            if(conditionType === "Identifier"){
                if(statementBody.condition.value === "true"){
                    for (var i = 0; i < statementBody.body.length; i++) {
                        decideStatement(statementBody.body[i]);
                    }
                }else if(statementBody.condition.value === "false"){
                    if(doesElseExist(statementBody)){
                        for (var i = 0; i < statementBody.else.length; i++) {
                            decideStatement(statementBody.else[i]);
                        }
                    }else{
                        break;
                    }
                }else{
                    //TODO int x = 1 / if(x)  lookup value
                }

            }else if(conditionType === "BinaryExpression") {
                var binaryExpressionResult = calculateBinaryExpression(statementBody.condition);
                if(binaryExpressionResult !== 0){
                    for (i = 0; i < statementBody.body.length; i++) {
                        decideStatement(statementBody.body[i]);
                    }
                }else{
                    if(doesElseExist(statementBody)){
                        for (i = 0; i < statementBody.else.length; i++) {
                            decideStatement(statementBody.else[i]);
                        }
                    }else{
                        break;
                    }
                }


            }else if(conditionType === "PrefixExpression"){
                // if(- + 2){works}



            }else if(condtionType === "Literal"){
                if(statementBody.condition.value !== 0){
                    for (i = 0; i < statementBody.body.length; i++) {
                        decideStatement(statementBody.body[i]);
                    }
                }else{
                    if(doesElseExist(statementBody)){
                        for (i = 0; i < statementBody.else.length; i++) {
                            decideStatement(statementBody.else[i]);
                        }
                    }else{
                        break;
                    }
                }
            }

        case("ExpressionStatement"):
            //TODO
            break;
        case("ForStatement"):
            if(statementBody.init.type === "VariableDeclaration"){
                if(statementBody.condition.type === "BinaryExpression"){
                    //decideExpression(statementBody.step.type);
                }else{
                    document.write("Invalid..")
                }
            }else{
                document.write("Invalid...")
            }

        case("WhileStatement"):
            if(statementBody.condition.type === "Identifier"){
                if(statementBody.condition.value === "true"){
                    for (i = 0; i < statementBody.body.length; i++) {
                        decideStatement(statementBody.body[i]);
                    }

                }else if (statementBody.condition.type === "BinaryExpression"){
                    var left = statementBody.condition.type.left.value;
                    var right = statementBody.condition.type.right.value;

                }
                else{
                    break;
                }
            }else{
                //TODO
            }


        case("ReturnStatement"):
            decideExpression(currentBody.value.value);
        //console.log(currentBody.value.value)
        //document.write(currentBody.value.value);
        default:

        //document.write("Invalid Argument...");
    }
}

function isStatement(stmt){
    if(stmt === "IfStatement" ||
        stmt === "ExpressionStatement" ||
        stmt === "WhileStatement" ||
        stmt === "ForStatement" ||
        stmt === "ReturnStatement" ||
        stmt === "BlockStatement"
    ){
        return true;
    }
}


function doesElseExist(stmtBody){
    return typeof stmtBody !== 'undefined';
}

function calculateBinaryExpression(statementBodyCondition) {
    var operator = statementBodyCondition.operator;
    var leftType = statementBodyCondition.left.type;
    var rightType = statementBodyCondition.right.type;
    var leftValue;
    var rightValue;

    decideExpression(rightType);
    decideExpression(leftType);

    // if (rightType === "Literal") {
    //     leftValue = statementBodyCondition.left.value;
    // } else if (rightType = "Identifier") {
    //     //TODO lookup value
    // } else if (rightType === "CallExpression") {
    //     //TODO I Dont know
    // }
    //devamı da olabilir
    //
    // if (leftType === "Literal") {
    //     rightValue = statementBodyCondition.left.value;
    // } else if (leftType = "Identifier") {
    //     //TODO lookup value
    // } else if (leftType === "CallExpression") {
    //     //TODO I Dont know
    // } else if (leftType === "BinaryExpression") {
    //     var newOperator = statementBodyCondition.left.operator;
    //     var newLeftValue = calculateBinaryExpression(statementBodyCondition.left);
    //     var newRightValue = calculateBinaryExpression(statementBodyCondition.right);
    //     return calculate(newOperator, newLeftValue,newRightValue);
    // }

    return calculate(operator, leftValue, rightValue);
}

function decideExpression(expr) {
    switch(expr) {
        case ("Literal"):
        //TODO
        case ("Identifier"):
        //TODO
        case ("BinaryExpression"):
        //TODO
        case ("PrefixExpression"):
        //TODO
        case ("CastExpression"):
        //TODO
    }
}

function calculate(operator, left, right) {
    if(operator === "+") {
        console.log(left+right);
    } else if(operator === "-") {
        console.log(left-right);
    } else if(operator === "*") {
        console.log(left*right);
    } else if(operator === "/") {
        console.log(left/right);
    } else if(operator === "<") {
        //TODO
    } else if(operator === ">") {
        //TODO
    }
}

function decideInstruction(instr) {


}


function lookup(key) {
    for (let i = 0; i < hashList.length; i++) {
        hashTable = hashList.get(i);
        if(hashTable.hasItem(key)) {
            return hashTable.getItem(key);
        }
    }
}

function addToEnvironment(key, value) {
    hashTable = hashList.get(0);
    hashTable.setItem(key, value);
}

function removeFromEnvironment(key) {
    for(let i = 0; i < hashList.length; i++) {
        hashTable = hashList.get(i);
        if(hashTable.hasItem(key)) {
            hashTable.removeItem(key);
            break;
        }
    }
}

function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }

    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}


//SuffixExpression
//CallExperession
//BinaryExpression