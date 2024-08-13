import * as fs from 'fs';
import {
    CollectionEntry,
} from '../src/models/api';
import { mainParser, echoParser } from '../src'

// Debug at https://menduz.github.io/ebnf-highlighter/

const collectionTxt = fs.readFileSync("data/cards_core.json", { encoding: "utf8" })
const uniques = JSON.parse(collectionTxt) as Array<CollectionEntry>

let stats = { parsed: 0, failed: 0, partial: 0, echo_parsed: 0, echo_failed: 0, echo_partial: 0 }
let fails: Array<String> = []

console.log("Parsing", Object.keys(uniques).length, "entries")

function cleanupRuleText(text) {
    return text.toLowerCase().replaceAll("#", "").replaceAll("\u00a0", " ")
}

for (let uniqId in uniques) {
    let uniq = uniques[uniqId]
    let name = uniq.name["en"]
    if (name == "Foiler") { continue; }
    if (!(uniq.type == "CHARACTER" || uniq.type == "PERMANENT")) { continue; }

    let cardEls = uniq.elements
    if (cardEls.MAIN_EFFECT) {
        const effects = cleanupRuleText(cardEls.MAIN_EFFECT["en"])
        let ast = mainParser.getAST(effects);
        if (ast) {
            if (ast.rest) {
                stats.partial += 1
                fails.push("[" + name + "]" + " ..." + ast.rest)
            } else {
                stats.parsed += 1
            }
        } else {
            stats.failed += 1
            fails.push("[" + name + "]" + effects)
        }
    }
    if (cardEls.ECHO_EFFECT) {
        const effects = cleanupRuleText(cardEls.ECHO_EFFECT["en"])
        let ast = echoParser.getAST(effects);
        if (ast) {
            if (ast.rest) {
                stats.echo_partial += 1
                fails.push("[" + name + "](ECHO)" + " ..." + ast.rest)
            } else {
                stats.echo_parsed += 1
            }
        } else {
            stats.echo_failed += 1
            fails.push("[" + name + "](ECHO)" + effects)
        }
    }
}

console.log("Done!\n", stats)
console.log("Fully parsed: ", Math.round(1000 * stats.parsed / (stats.parsed + stats.partial + stats.failed)) / 10.0, "%")

fs.writeFileSync("temp/rejects.txt", fails.join("\n"))