logic = first:andLogic tail:(_ '|' _ andLogic)* {
    if (tail.length === 0) {
        return first;
    } else {
        return {
            type: 'or',
            expr: [first, ...tail.map(t => t[3])]
        }
    }
}

andLogic = first:baseLogic tail:(_ '+' _ baseLogic)* {
    if (tail.length === 0) {
        return first;
    } else {
        return {
            type: 'and',
            expr: [first, ...tail.map(t => t[3])]
        }
    }
}

baseLogic = '(' _ logic:logic _ ')' { return logic } / term

term = ('['/']'/[A-Za-z0-9'_-])+ {
    return { type: 'term', expr: text() }
}

_ = (' ' / '\n')*