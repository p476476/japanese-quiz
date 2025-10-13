import type {Word} from "~/interfaces/word";

export const getWordList = async ():Promise<Word[][]> => {
    const isLoaded = ref(false)
    const allWords = ref<Word[][]>([])
    
    const loadWords = async () => {
        if (isLoaded.value) return
        try {
            const data= await useFetch('/api/words')
            if (data.data.value && data.data.value.allWords) {
                allWords.value = data.data.value.allWords
            }
            isLoaded.value = true
        } catch (error) {
            console.error('Error loading words:', error)
        }
    }

    await loadWords()
    return allWords.value
}