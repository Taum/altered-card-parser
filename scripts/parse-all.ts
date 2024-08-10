import * as fs from 'fs';
import {
    CollectionEntry,
} from '../src/models/api';

import { IToken, Grammars } from 'ebnf';

const grammar = fs.readFileSync('src/grammar.ebnf', { encoding: "utf8" })

// Debug at https://menduz.github.io/ebnf-highlighter/
let parser = new Grammars.W3C.Parser(grammar, { debug: false });

const collectionTxt = fs.readFileSync("data/uniques-extd.json", { encoding: "utf8" })
const uniques = JSON.parse(collectionTxt) as Array<CollectionEntry>

let stats = { parsed: 0, failed: 0, partial: 0 }
let fails: Array<String> = []

console.log("Parsing ", uniques.length, " entries")

for (let uniq of uniques) {
    if (uniq.name == "Foiler") { continue; }

    let cardEls = uniq.elements
    if (cardEls.MAIN_EFFECT) {
        const effects = cardEls.MAIN_EFFECT.toLowerCase()
        let mainAST = parser.getAST(effects);
        if (mainAST) {
            if (mainAST.rest) {
                stats.partial += 1
                fails.push("[" + uniq.name + "]" + " ..." + mainAST.rest)
            } else {
                stats.parsed += 1
            }
        } else {
            stats.failed += 1
            fails.push("[" + uniq.name + "]" + effects)
        }
    }
}

console.log("Done!\n", stats)
console.log("Fully parsed: ", Math.round(1000 * stats.parsed / (stats.parsed + stats.partial + stats.failed)) / 10.0, "%")

fs.writeFileSync("temp/rejects.txt", fails.join("\n"))