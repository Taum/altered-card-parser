import * as fs from 'fs';
import {
    CollectionEntry,
} from '../src/models/api';
import { IToken } from 'ebnf'
import { mainParser, echoParser } from '../src'

// Debug at https://menduz.github.io/ebnf-highlighter/

const collectionTxt = fs.readFileSync("data/cards.json", { encoding: "utf8" })
const cardsDB = JSON.parse(collectionTxt) as Array<CollectionEntry>

console.log("Parsing", Object.keys(cardsDB).length, "entries")

const nodeNamesToErase = ["CardType", "CharacterType", "CharacterStatus"]
const nodeNamesToSaveValue = ["Amount", "ManaValue"]

function trimToSerialize(node: IToken) {
    if (nodeNamesToErase.find((x) => x == node.type) && node.children.length == 1) {
        return trimToSerialize(node.children[0])
    }
    let value: string | undefined = undefined
    if (nodeNamesToSaveValue.find((x) => x == node.type)) {
        value = node.text.trim()
    }
    return {
        type: node.type,
        start: node.start,
        end: node.end,
        value: value,
        children: node.children.map(trimToSerialize)
    }
}

let errorCount = 0

for (let idx in cardsDB) {
    let uniq = cardsDB[idx]
    if (uniq.name == "Foiler") { continue; }

    let cardEls = uniq.elements
    let mainAST = null
    let echoAST = null
    if (cardEls.MAIN_EFFECT) {
        const effects = cardEls.MAIN_EFFECT["en"].toLowerCase()
        const ast = mainParser.getAST(effects)
        mainAST = trimToSerialize(ast)
        if (ast == null || ast.rest.length > 0) { errorCount += 1 }
    }
    if (cardEls.ECHO_EFFECT) {
        const effects = cardEls.ECHO_EFFECT["en"].toLowerCase()
        const ast = echoParser.getAST(effects)
        echoAST = trimToSerialize(ast)
        if (ast == null || ast.rest.length > 0) { errorCount += 1 }
    }
    cardsDB[idx].parsed = { mainAST, echoAST }
}

console.log("Done with", errorCount, "errors")

fs.writeFileSync("data/cards_with_ast.json", JSON.stringify(cardsDB, null, "  "))