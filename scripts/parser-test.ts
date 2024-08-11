import * as fs from 'fs';
import {
    CollectionEntry,
} from '../src/models/api';
import { IToken } from 'ebnf'
import { mainParser, echoParser } from '../src'

// Debug at https://menduz.github.io/ebnf-highlighter/

function getAST(parser, text): IToken {
    return parser.getAST(text.toLowerCase())
}

const useMainTestSet = false
const useEchoTestSet = true

if (useMainTestSet) {
    let testStrings = [
        "{J} If you control two or more Landmarks: Create an [Ordis Recruit 1/1/1] Soldier token in your Hero Expedition.",
        "When my Expedition fails to move forward during Dusk — After Rest: []Draw a card.",
        "{J} If you control two or more Landmarks: Create an [Ordis Recruit 1/1/1] Soldier token in your Hero Expedition.  When my Expedition fails to move forward during Dusk — After Rest: []Draw a card.",
        "When you play a Spell — []Up to one target Character gains [[Fleeting]].",
        "{J} []The next Permanent you play this Afternoon costs {1} less.  When an opponent draws one or more cards or does [Resupply] — You may put a card from your hand in Reserve. If you do: Create an [Ordis Recruit 1/1/1] Soldier token in your other Expedition (the one I'm not in).",
        "{H} You may discard a card from your Reserve. If you do: Draw a card.",
        "When you play a Spell — I gain 1 boost.",
        "{H} You may discard a card from your Reserve. If you do: I gain 1 boost.",
        "{H} You may discard a card from your Reserve. If you do: Each player draws a card.",
        "When I go to Reserve from the Expedition Zone — If I have 1 or more boosts: Draw a card.",
        "{J} []I gain [[Anchored]].  When I go to Reserve from the Expedition Zone — If I have 1 or more boosts: Each player draws a card.",
        "{R} []Target Character gains 2 boosts.",
        "{J} You may put a card from your hand in Reserve. If it's a Permanent: You may return a card from your Reserve to your hand."
    ]

    for (let test of testStrings) {
        console.log("Testing: ", test, "\n")

        let output = getAST(mainParser, test)
        describeTree(output)

        console.log("---------------")
    }
}
if (useEchoTestSet) {
    let testStrings = [
        "{D} : []The next card you play this Afternoon costs {1} less.",
        "{D} : []Up to one target Character with Hand Cost {3} or less other than me gains [[Anchored]]."
    ]

    for (let test of testStrings) {
        console.log("Testing: ", test.toLowerCase(), "\n")

        let output = getAST(echoParser, test)
        describeTree(output)

        console.log("---------------")
    }
}

if (!useMainTestSet && !useEchoTestSet) {
    const collectionTxt = fs.readFileSync("data/cards.json", { encoding: "utf8" })
    const uniques = JSON.parse(collectionTxt) as Array<CollectionEntry>

    for (let uniq of uniques.slice(0, 30)) {
        if (uniq.name == "Foiler") { continue; }

        let cardEls = uniq.elements
        console.log("Card: ", uniq.name)
        console.log("Image: ", uniq.imagePath)
        if (cardEls.MAIN_EFFECT) {
            console.log("main: -> ", cardEls.MAIN_EFFECT)
            const mainAST = getAST(mainParser, cardEls.MAIN_EFFECT);
            describeTree(mainAST)
            if (mainAST == null) {
                break;
            }
        }
        if (cardEls.ECHO_EFFECT) {
            console.log("echo: -> ", cardEls.ECHO_EFFECT)
            const echoAST = getAST(echoParser, cardEls.ECHO_EFFECT);
            describeTree(echoAST)
            if (echoAST == null) {
                break;
            }
        }
        console.log("-------------------------------------------------")
    }
}

function describeTree(token: IToken) {
    if (token) {
        printAST(token)
        if (token.rest) {
            console.log(" ** remaining : ", token.rest)
        }
    } else {
        console.log("Failed to parse")
    }
}

function printAST(token: IToken, level = 0) {
    if (token) {
        console.log(
            '  '.repeat(level) + `|-${token.type}${token.children.length == 0 ? '=' + token.text : ''}`
        );
        token.children && token.children.forEach(c => {
            printAST(c, level + 1);
        });
    } else {
        console.log('  '.repeat(level) + '???')
    }
}