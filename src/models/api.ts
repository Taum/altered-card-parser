export interface CollectionAPIResponse {
    "hydra:totalItems": Number
    "hydra:member": Array<CollectionEntry>
    "hydra:view": SearchMeta
}
export interface SearchMeta {
    "@id": string
    "hydra:first": string
    "hydra:next"?: string
    "hydra:last": string
}

export interface CollectionEntry {
    reference: string
    name: string
    imagePath: string
    inMyCollection: Number
    collectorNumberFormatted: string
    elements: CardElements
    parsed?: ParseResult
    type: "SPELL" | "CHARACTER" | "PERMANENT" | "HERO" | "TOKEN" | "TOKEN_MANA"
}

export interface CardElements {
    MAIN_COST: string
    RECALL_COST: string
    MOUNTAIN_POWER: string
    OCEAN_POWER: string
    FOREST_POWER: string
    MAIN_EFFECT?: string
    ECHO_EFFECT?: string
}

export interface ParseResult {
    mainAST: any
    echoAST: any
}


export interface CSVRow {
    id: string
    handCost: string
    reserveCost: string
    forestPower: string
    mountainPower: string
    waterPower: string
    abilities: string
    supportAbility: string
    parsed?: ParseResult
}