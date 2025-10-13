import type {Word} from "~/interfaces/word";

async function fetchSpreadsheetCount(spreadsheetId: string, apiKey: string): Promise<number> {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`)
    const data = await res.json()
    return data.sheets.length
}

export async function fetchWordsFromSheet(spreadsheetId: string, range: string, apiKey: string): Promise<Word[]> {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
    const data = await res.json()
    return data.values.map((row: string[]) => ({kanji: row[0], hiragana: row[1], meaning: row[2]}))
}

export default defineEventHandler(async () => {
    const apiKey = process.env.GOOGLE_API_KEY
    const spreadsheetId = process.env.SPREADSHEET_ID

    if (!apiKey || !spreadsheetId) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Missing Google Sheets API credentials.'
        })
    }

    const sheetCount = await fetchSpreadsheetCount(spreadsheetId, apiKey)
    const allWords: Word[][] = []

    try {
        for (let i = 0; i < sheetCount; i++) {
            const range = encodeURIComponent(`DAY${i + 1}!A:C`)
            const words = await fetchWordsFromSheet(spreadsheetId, range, apiKey)
            allWords.push(words)
        }
        return {allWords : allWords}
    } catch (err: any) {
        console.error('Failed to fetch Google Sheet:', err)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to load words.'
        })
    }
})