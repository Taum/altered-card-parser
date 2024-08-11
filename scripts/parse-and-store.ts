import * as fs from 'fs';
import {
    CollectionEntry,
} from '../src/models/api';

import { IToken, Grammars } from 'ebnf';

const mainGrammar = fs.readFileSync('src/main-effect.ebnf', { encoding: "utf8" })
const echoGrammar = fs.readFileSync('src/echo-effect.ebnf', { encoding: "utf8" })

// Debug at https://menduz.github.io/ebnf-highlighter/
let mainParser = new Grammars.W3C.Parser(mainGrammar, { debug: false });
let echoParser = new Grammars.W3C.Parser(echoGrammar, { debug: false });

const collectionTxt = fs.readFileSync("data/cards_uniques.json", { encoding: "utf8" })
const uniques = JSON.parse(collectionTxt) as Array<CollectionEntry>

console.log("Parsing ", uniques.length, " entries")

const nodeNamesToErase = ["CardType", "CharacterType", "CharacterStatus"]

function trimToSerialize(node: IToken) {
    if (nodeNamesToErase.find((x) => x == node.type) && node.children.length == 1) {
        return trimToSerialize(node.children[0])
    }
    return {
        type: node.type,
        start: node.start,
        end: node.end,
        children: node.children.map(trimToSerialize)
    }
}

for (let idx in uniques) {
    let uniq = uniques[idx]
    if (uniq.name == "Foiler") { continue; }

    let cardEls = uniq.elements
    let mainAST = null
    let echoAST = null
    if (cardEls.MAIN_EFFECT) {
        const effects = cardEls.MAIN_EFFECT["en"].toLowerCase()
        mainAST = trimToSerialize(mainParser.getAST(effects))
    }
    if (cardEls.ECHO_EFFECT) {
        const effects = cardEls.ECHO_EFFECT["en"].toLowerCase()
        echoAST = trimToSerialize(echoParser.getAST(effects))
    }
    uniques[idx].parsed = { mainAST, echoAST }
}

console.log("Done!\n")

fs.writeFileSync("data/cards_uniques_parsed.json", JSON.stringify(uniques, null, "  "))