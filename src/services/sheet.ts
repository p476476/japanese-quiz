import type {Word} from "../interfaces/word.ts";

export async function fetchWordsFromSheet(spreadsheetId: string, range: string, apiKey: string): Promise<Word[]> {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
    const data = await res.json()
    return data.values.map((row: string[]) => ({kanji: row[0], hiragana: row[1]}))
}

export async function fetchSpreadsheetCount(spreadsheetId: string, apiKey: string): Promise<number> {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`)
    const data = await res.json()
    return data.sheets.length
}