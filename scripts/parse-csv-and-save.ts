import * as fs from 'fs';
import {
    CSVRow,
} from '../src/models/api';
import csv from 'csv-parser';
import { IToken } from 'ebnf'
import { mainParser, echoParser } from '../src'

// Debug at https://menduz.github.io/ebnf-highlighter/

let results = [];

fs.createReadStream('data/export_cards_uniques_en_lite.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        parseResults(results);
    })

function cleanupRuleText(text) {
    return text.toLowerCase().replaceAll("#", "").replaceAll("\u00a0", " ")
}

function parseResults(results: Array<CSVRow>) {
    console.log("Parsing", results.length, "entries")

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
    let cardsDB = {}

    for (let uniq of results) {
        let mainAST = null
        let echoAST = null
        if (uniq.abilities) {
            const effects = cleanupRuleText(uniq.abilities)
            const ast = mainParser.getAST(effects)
            mainAST = trimToSerialize(ast)
            if (ast == null || ast.rest.length > 0) { errorCount += 1 }
        }
        if (uniq.supportAbility) {
            const effects = cleanupRuleText(uniq.supportAbility)
            const ast = echoParser.getAST(effects)
            echoAST = trimToSerialize(ast)
            if (ast == null || ast.rest.length > 0) { errorCount += 1 }
        }
        cardsDB[uniq.id] = {
            ...uniq,
            parsed: { mainAST, echoAST }
        }
    }

    console.log("Done with", errorCount, "errors")

    fs.writeFileSync("data/cards_all_with_ast.json", JSON.stringify(cardsDB, null, "  "))
}