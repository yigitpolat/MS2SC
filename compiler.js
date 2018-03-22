var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);


for(var i = 0; i < myJSon.length; i++) {					//go over function declarations
    for(var j = 0; j < myJSon[i].body.length; j++){		    //go over function body
        if(isStatement(myJSon[i].body[j].type)){			//
            var currentBody = myJSon[i].body[j];
            decideStatement(currentBody);
        }
        //else if(isVariableDeclaration){
        // TODO
        //}
    }
}

function decideStatement(statementBody) {
    var currentStatement = statementBody.type;			//types -> VariableDeclaration // ...Statement
    switch(currentStatement) {

        case("IfStatement"):
            if(statementBody.condition.type == "Identifier"){
                if(statementBody.condition.value == "true"){
                    for (var i = 0; i < statementBody.body.length; i++) {
                        decideStatement(statementBody.body[i]);
                    }
                }else{
                    for (var i = 0; i < statementBody.else.length; i++) {
                        decideStatement(statementBody.else[i]);
                    }
                }
            }else if("BinaryExpression"){
                var left = statementBody.left.type;
                var right = statementBody.right.type;
                var operator = statementBody.operator;
                calculate(operator, left, right);
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