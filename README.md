# altered-card-parser

Parse card text into an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)

This repo provides 2 EBNF grammars to parse the "Main" and "Echo" effects of characters.

Uses https://github.com/lys-lang/node-ebnf

### How to use

Download dependencies with:
```yarn install```

1. Download a list of cards to parse using https://github.com/chardetm/altered-scripts
2. Put the list in `data/cards.json`. It should use the following format:
3. Run `yarn run parse-and-save`. The script will output a `data/cards_with_ast.json` file where each card has an added `parsed` entry containing the Main effect and Echo effect ASTs.

### Examples

Input: `cards.json`
```
{
    "ALT_COREKS_B_BR_22_U_3404": {
        "id": "ALT_COREKS_B_BR_22_U_3404",
        "name": {
            "en": "Shenlong"
        },
        "imagePath": {
            "en": "https://altered-prod-eu.s3.amazonaws.com/Art/COREKS/CARDS/ALT_COREKS_B_BR_22/UNIQUE/JPG/en_US/0afbdf65d635be1e668d5914f2ce9496.jpg"
        },
        "elements": {
            "MAIN_COST": "5",
            "RECALL_COST": "6",
            "MOUNTAIN_POWER": "6",
            "OCEAN_POWER": "5",
            "FOREST_POWER": "5",
            "MAIN_EFFECT": {
                "en": "[][]I am [Tough 2].  {H} You may put a card from your hand in Reserve. If you do: Up to one target Character gains [[Asleep]]."
            },
            "ECHO_EFFECT": {
                "en": "{D} : []Draw a card."
            }
        }
        ...
    },
    "ALT_COREKS_B_MU_13_U_4717": {
        "id": "ALT_COREKS_B_MU_13_U_4717",
        "name": {
            "en": "Muna Druid"
        },
        "imagePath": {
            "en": "https://altered-prod-eu.s3.amazonaws.com/Art/COREKS/CARDS/ALT_CORE_B_MU_13/UNIQUE/JPG/en_US/cd23c216c6bc3a7f5b8a32639c882bef.jpg"
        },
        "elements": {
            "MAIN_COST": "4",
            "RECALL_COST": "2",
            "MOUNTAIN_POWER": "4",
            "OCEAN_POWER": "3",
            "FOREST_POWER": "3",
            "MAIN_EFFECT": {
                "en": "{H} []Target Character gains 1 boost."
            },
            "ECHO_EFFECT": {
                "en": "{D} : []Up to one target Character with Hand Cost {3} or less other than me gains [[Anchored]]."
            }
        }
        ...
    },
    ...
}
```


Output: `cards_with_ast.json`
```
{
    "ALT_COREKS_B_BR_22_U_3404": {
        "id": "ALT_COREKS_B_BR_22_U_3404",
        "name": ...
        "imagePath": ...
        "elements": {
            "MAIN_COST": "5",
            "RECALL_COST": "6",
            "MOUNTAIN_POWER": "6",
            "OCEAN_POWER": "5",
            "FOREST_POWER": "5",
            "MAIN_EFFECT": {
                "en": "[][]I am [Tough 2].  {H} You may put a card from your hand in Reserve. If you do: Up to one target Character gains [[Asleep]]."
            },
            "ECHO_EFFECT": {
                "en": "{D} : []Draw a card."
            }
        }
        "parsed": {
            "mainAST": {
                "type": "MainEffects",
                "start": 0,
                "end": 126,
                "children": [
                {
                    "type": "ContinuousAbility",
                    "start": 0,
                    "end": 19,
                    "children": [
                    {
                        "type": "ContinousEffects",
                        "start": 4,
                        "end": 19,
                        "children": [
                        {
                            "type": "ContinousEffectContent",
                            "start": 4,
                            "end": 18,
                            "children": [
                            {
                                "type": "EffectIAm",
                                "start": 4,
                                "end": 18,
                                "children": [
                                {
                                    "type": "AbilityWord",
                                    "start": 9,
                                    "end": 18,
                                    "children": [
                                    {
                                        "type": "AbilityTough2",
                                        "start": 9,
                                        "end": 18,
                                        "children": []
                                    }
                                    ]
                                }
                                ]
                            }
                            ]
                        }
                        ]
                    }
                    ]
                },
                {
                    "type": "TriggeredAbility",
                    "start": 21,
                    "end": 126,
                    "children": [
                    {
                        "type": "TriggerEvent",
                        "start": 21,
                        "end": 25,
                        "children": [
                        {
                            "type": "TriggerFromHand",
                            "start": 21,
                            "end": 25,
                            "children": []
                        }
                        ]
                    },
                    {
                        "type": "TriggerAction",
                        "start": 25,
                        "end": 126,
                        "children": [
                        {
                            "type": "TriggerActionCost",
                            "start": 25,
                            "end": 80,
                            "children": [
                            {
                                "type": "ActionCostHandToReserve",
                                "start": 25,
                                "end": 80,
                                "children": []
                            }
                            ]
                        },
                        {
                            "type": "ActionContents",
                            "start": 82,
                            "end": 125,
                            "children": [
                            {
                                "type": "ActionModifyStatus",
                                "start": 82,
                                "end": 125,
                                "children": [
                                {
                                    "type": "ActionTargetGainStatus",
                                    "start": 82,
                                    "end": 125,
                                    "children": [
                                    {
                                        "type": "TextQuantity",
                                        "start": 87,
                                        "end": 92,
                                        "children": [
                                        {
                                            "type": "TextQuantity1",
                                            "start": 88,
                                            "end": 91,
                                            "children": []
                                        }
                                        ]
                                    },
                                    {
                                        "type": "CharacterStatusAsleep",
                                        "start": 115,
                                        "end": 125,
                                        "children": []
                                    }
                                    ]
                                }
                                ]
                            }
                            ]
                        }
                        ]
                    }
                    ]
                }
                ]
            },
            "echoAST": {
                "type": "EchoEffects",
                "start": 0,
                "end": 20,
                "children": [
                {
                    "type": "ActionContents",
                    "start": 8,
                    "end": 19,
                    "children": [
                    {
                        "type": "ActionDraw",
                        "start": 8,
                        "end": 19,
                        "children": [
                        {
                            "type": "TextQuantity",
                            "start": 12,
                            "end": 15,
                            "children": [
                            {
                                "type": "TextQuantity1",
                                "start": 13,
                                "end": 14,
                                "children": []
                            }
                            ]
                        }
                        ]
                    }
                    ]
                }
                ]
            }
        }
    },
    ...
}
```


