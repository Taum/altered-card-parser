import * as fs from 'fs';
import { IToken, Grammars } from 'ebnf';

const common = fs.readFileSync('src/common.ebnf', { encoding: "utf8" })
const mainGrammar = fs.readFileSync('src/main-effect.ebnf', { encoding: "utf8" }) + "\n" + common
const echoGrammar = fs.readFileSync('src/echo-effect.ebnf', { encoding: "utf8" }) + "\n" + common

// Debug at https://menduz.github.io/ebnf-highlighter/
export const mainParser = new Grammars.W3C.Parser(mainGrammar, { debug: false });
export const echoParser = new Grammars.W3C.Parser(echoGrammar, { debug: false });
