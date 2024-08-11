import * as fs from 'fs';
import {
    CSVRow,
} from '../src/models/api';

const collectionTxt = fs.readFileSync("data/cards_all_with_ast.json", { encoding: "utf8" })
const cardsDB = JSON.parse(collectionTxt)

interface TreeNode {
    type: string,
    count: number
    children: Array<TreeNode>
}

let mainEffects: TreeNode = {
    type: "MainEffects",
    count: 0,
    children: [],
}
let echoEffects: TreeNode = {
    type: "EchoEffects",
    count: 0,
    children: [],
}


console.log("Computing tree frequencies for", Object.keys(cardsDB).length, "cards")

for (let id in cardsDB) {
    const card = cardsDB[id] as CSVRow

    if (card.parsed?.mainAST) {
        incrementCount(mainEffects, card.parsed?.mainAST)
    }
    if (card.parsed?.echoAST) {
        incrementCount(echoEffects, card.parsed?.echoAST)
    }
}

function incrementCount(countNode, cardNode) {
    countNode.count += 1
    for (let child of cardNode.children) {
        let countChild = countNode.children.find((n) => n.type == child.type && (n.value ? n.value == child.value : true))
        if (!countChild) {
            countChild = {
                type: child.type,
                value: child.value,
                count: 0,
                children: []
            }
            countNode.children.push(countChild)
        }
        incrementCount(countChild, child)
    }
}

console.log("Writing frequencies...")

const output = {
    totalCount: Object.keys(cardsDB).length,
    main: mainEffects,
    echo: echoEffects,
}
fs.writeFileSync("data/tree_frequencies.json", JSON.stringify(output, null, "  "))