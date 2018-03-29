var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);


for(var i = 0; i < myJSon.length; i++) {               //go over function declarations
    for(var j = 0; j < myJSon[i].body.length; j++){           //go over function body
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
    var currentStatement = statementBody.type;       //types -> VariableDeclaration // ...Statement

    switch(currentStatement) {


        case("IfStatement"):
            var condtionType = statementBody.condition.type;
            if(condtionType == "Identifier"){
                if(statementBody.condition.value == "true"){
                    for (var i = 0; i < statementBody.body.length; i++) {
                        decideStatement(statementBody.body[i]);
                    }
                }else if(statementBody.condition.value == "false"){
                    if(isElseExists(statementBody)){
                        for (var i = 0; i < statementBody.else.length; i++) {
                            decideStatement(statementBody.else[i]);
                        }
                    }else{
                        break;
                    }
                }else{
                    //TODO int x = 1 / if(x)  lookup value
                }

            }else if(condtionType == "BinaryExpression") {
                var binaryExpressionResult = calculateBinaryExpression(statementBody.condition);
                if(binaryExpressionResult != 0){
                    for (var i = 0; i < statementBody.body.length; i++) {
                        decideStatement(statementBody.body[i]);
                    }
                }else{
                    if(isElseExists(statementBody)){
                        for (var i = 0; i < statementBody.else.length; i++) {
                            decideStatement(statementBody.else[i]);
                        }
                    }else{
                        break;
                    }
                }


            }else if(conditionType == "PrefixExpression"){
                // if(- + 2){works}



            }else if(condtionType == "Literal"){
                if(statementBody.condition.value != 0){
                    for (var i = 0; i < statementBody.body.length; i++) {
                        decideStatement(statementBody.body[i]);
                    }
                }else{
                    if(isElseExists(statementBody)){
                        for (var i = 0; i < statementBody.else.length; i++) {
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
            if(statementBody.init.type == "VariableDeclaration"){
                if(statementBody.condition.type == "BinaryExpression"){
                    //decideExpression(statementBody.step.type);
                }else{
                    document.write("Invalid..")
                }
            }else{
                document.write("Invalid...")
            }

        case("WhileStatement"):
            if(statementBody.condition.type == "Identifier"){
                if(statementBody.condition.value == "true"){
                    for (var i = 0; i < statementBody.body.length; i++) {
                        decideStatement(statementBody.body[i]);
                    }
                }else{
                    break;
                }
            }else{
                //TODO
            }


        case("ReturnStatement"):
        //console.log(currentBody.value.value)
        //document.write(currentBody.value.value);
        default:

        //document.write("Invalid Argument...");
    }
}

function isStatement(stmt){
    if(stmt == "IfStatement" ||
        stmt == "ExpressionStatement" ||
        stmt == "WhileStatement" ||
        stmt == "ForStatement" ||
        stmt == "ReturnStatement" ||
        stmt == "BlockStatement"
    ){
        return true;
    }
}


function isElseExists(stmtBody){
    if(typeof stmtBody != 'undefined'){
        return true;
    }else{
        return false;
    }
}


function calculateBinaryExpression(statementBodyCondition) {
    var operator = statementBodyCondition.operator;
    var leftType = statementBodyCondition.left.type;
    var rightType = statementBodyCondition.right.type;
    var leftValue;
    var rightValue;

    if (rightType == "Literal") {
        leftValue = statementBodyCondition.left.value;
    } else if (rightType = "Identifier") {
        //TODO lookup value
    } else if (rightType == "CallExpression") {
        //TODO I Dont know
    }
    //devamı da olabilir


    if (leftType == "Literal") {
        rightValue = statementBodyCondition.left.value;
    } else if (leftType = "Identifier") {
        //TODO lookup value
    } else if (leftType == "CallExpression") {
        //TODO I Dont know
    } else if (leftType == "BinaryExpression") {
        var newOperator = statementBodyCondition.left.operator;
        var newLeftValue = calculateBinaryExpression(statementBodyCondition.left);
        var newRightValue = calculateBinaryExpression(statementBodyCondition.right);
        return calculate(newOperator, newLeftValue,newRightValue);
    }

    return calculate(operator, leftValue, rightValue);
}




function decideExpression(expr) {
    switch(expr) {
        case ("BinaryExpression"):
        //TODO
        case ("PrefixExpression"):
        //TODO
        case ("CastExpression"):
        //TODO
    }
}

function calculate(operator, left, right) {
    if(operator == "+") {
        //left + right;
    } else if(operator == "-") {
        //TODO
    } else if(operator == "*") {
        //TODO
    } else if(operator == "/") {
        //TODO
    } else if(operator == "<") {
        //TODO
    } else if(operator == ">") {
        //TODO
    }
}


//SuffixExpression
//CallExperession
//BinaryExpression