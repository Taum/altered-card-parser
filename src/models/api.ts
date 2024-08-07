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
