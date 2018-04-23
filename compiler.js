var fs = require("fs");
var content = fs.readFileSync("AST.json").toString();
var myJSon = JSON.parse(content);
var hashList = {};

var stackPointer = 1;
var basePointer = 2;
var zero = 3;
var negativeOne = 4;
var vscpuSpecials = [5, 6, 7, 8, 9, 10];
var scratchMem1 = 11;
var scratchMem2 = 12;
var scratchMem3 = 13;
var scratchMem4 = 14;
var scratchMem5 = 15;
var scratchMem6 = 16;
var globalDataBase = 17;

function increaseSP() {
    stackPointer++;
}

function decreaseSP() {
    stackPointer--;
}

for (let i = 0; i < myJSon.length; i++) {
    decideDeclaration(myJSon[i]);
}

function addToEnvironment(key) {
    if (hashList.length > 0) {
        hashTable = hashList.get(0);
    } else {
        var hashTable = new HashTable({});
        hashList.unshift(hashTable);
    }
    hashTable.setItem(key, hashTable.getNextIndex());
    hashTable.nextIndex += 1;
}


function decideDeclaration(declaration) {
    switch (declaration) {
        case("FuctionDeclaration"):
            //Fundec of typ option * string * (typ * string) list * stmt
            let hashTable = new HashTable({});
            hashList.unshift(hashTable);
            for (let i = 0; i < declaration.body.length; i++) {
                declerationOrStatement(declaration.body[i]);
            }

        case("VariableDeclaration"):
            // Vardec of typ * string * expr option
            addToEnvironment(declaration.name);
        //value??
    }
}

function declerationOrStatement(bodyElement) {
    if (bodyElement.type === "VariableDeclaration") {
        addToEnvironment(declaration.body[i].name);
        //value?
    } else {
        decideStatement(bodyElement);
    }
}

function decideStatement(bodyElement) {
    let currentStatement = bodyElement.type;
    switch (currentStatement) {
        case("IfStatement"):
            var condition = bodyElement.condition;
            decideExpression(condition);
            for (let i = 0; i < currentStatement.body.length; i++) {
                var thenStatement = currentStatement.body[i];
                decideStatement(thenStatement);
            }

            if (doesElseExist(currentStatement.else)) {
                for (let j = 0; j < currentStatement.body.length; j++) {
                    var thenStatement = currentStatement.body[j];
                    decideStatement(thenStatement);
                }

            }

        case("ExpressionStatement"):
            decideExpression(currentStatement.expression);
            break;

        case("ForStatement"):
            var init = currentStatement.init;
            decideExpression(init);
            var condition = currentStatement.condition;
            decideExpression(condition);
            var step = currentStatement.step;
            decideExpression(step);
            for (let i = 0; i < currentStatement.body.length; i++) {
                var stmt = currentStatement.body[i];
                decideStatement(stmt);
            }

        case("WhileStatement"):
            var condition = currentStatement.condition;
            decideExpression(condition);
            for (let i = 0; i < currentStatement.body.length; i++) {
                var stmt = currentStatement.body[i];
                decideStatement(stmt);
            }

        case("ReturnStatement"):
            var value = currentStatement.value;
            decideExpression(value);
            hashList.shift();

        default:

    }
}

function decideExpression(expr) {
    var expressionType = expr.type;
    switch (expressionType) {
        case ("Literal"):
            var key = expr.type;
            addToEnvironment(key);

        case ("Identifier"):
            var value = expr.value;

        case ("BinaryExpression"):
            var operator = expr.operator;
            var leftValue = decideExpression(expr.left);
            var rightValue = decideExpression(expr.right);

        case ("PrefixExpression"):
            var operator = expr.operator;
            var value = decideExpression(expr.value);

        case ("SuffixExpression"):
            var operator = expr.operator;
            var value = decideExpression(expr.value);

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

function decideBinaryExpression(operator) {
    switch (operator) {

        case("+"):


        case("-"):


        case("/"):


        case("*"):


        case("&&"):


        case("||"):


        case("&"):


        case("|"):

    }
}

function doesElseExist(stmtBody) {
    return typeof stmtBody !== 'undefined';
}

function lookup(key) {
    for (let i = 0; i < hashList.length; i++) {
        var hashTable = hashList.get(i);
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
        } else {
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
            var previous = this.items[key];
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

