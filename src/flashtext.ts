import Trie from './trie'

export interface FlashTextOpt {
  ignore?: boolean, // ignore case
}

export interface BoundaryTestFn {
  test: (c: string) => boolean;
}

export type KeyWordObj = {
  [key: string]: string[]
}

const defaultOption: FlashTextOpt = {
  ignore: false,
}

export const KEYWORD = '__FlashText.js__'

export default class FlashText {
  private option: FlashTextOpt
  private readonly trie: Trie
  private boundaries: RegExp | BoundaryTestFn
  private whitespaceChars: Set<string>

  constructor(opt?: FlashTextOpt) {
    this.option = Object.assign({}, defaultOption, opt)
    this.trie = new Trie(this.option)
    this.boundaries = /[a-zA-Z0-9-]/g
    this.whitespaceChars = new Set(['.', '\t', '\n', '\a', ' ', ','])
  }

  get size() {
    return this.trie.length
  }

  get _trie() {
    return this.trie
  }

  setBoundaries(r: RegExp | BoundaryTestFn) {
    if (r) this.boundaries = r
    return this
  }

  setWhiteSpaceChars(c: string[]) {
    if (Array.isArray(c) && c.length) this.whitespaceChars = new Set(c)
    return this
  }

  addWhiteSpaceChars(c: string) {
    if (c) this.whitespaceChars.add(c)
    return this
  }

  addKeyWord(keyword: string, mapped?: string) {
    this.trie.insert(keyword, mapped)
  }

  addKeyWordsFromArray(keywords: string[], mapped?: string) {
    if (Array.isArray(keywords) && keywords.length)
      keywords.forEach(k => this.addKeyWord(k, mapped))
  }

  addKeyWordsFromObject(obj: KeyWordObj = {}) {
    for (const [mapped, keywords] of Object.entries(obj))
      this.addKeyWordsFromArray(keywords, mapped)
  }

  removeKeyWord(keyword: string) {
    return this.trie.del(keyword)
  }

  removeKeyWordsFromArray(keywords: string[]) {
    if (Array.isArray(keywords) && keywords.length)
      keywords.forEach(k => this.removeKeyWord(k))
  }

  get(keyword: string) {
    return this.trie.get(keyword)
  }

  toMap() {
    return this.trie.toMap()
  }

  extractKeywords(sentence: string) {
    if (!sentence || typeof sentence !== 'string') return sentence
    if (this.option.ignore) sentence = sentence.toLowerCase()

    const kws = [];
    let trie: any = this.trie._root
    let end = 0
    let i = 0
    let len = sentence.length

    while(i < len) {
      let char = sentence[i], sequenceFound;
      if (!this.boundaries.test(char)) {
        if (trie[KEYWORD] || trie[char]) {
          let longestSequenceFound, isLongerSequenceFound = false;
          // 找到最后
          if (trie[KEYWORD]) {
            sequenceFound = trie[KEYWORD]
            longestSequenceFound = trie[KEYWORD]
            end = i
          }
          if (trie[char]) {
            let ii = i + 1
            let continued = trie[char]

            while (ii < len) {
              let _char = sentence[ii]
              // 找到最后
              if (!this.boundaries.test(_char) && continued[KEYWORD]) {
                longestSequenceFound = continued[KEYWORD]
                end = ii
                isLongerSequenceFound = true
              }

              if (continued[_char]) {
                continued = continued[_char]
              }
              else break
              ++ii
            }

            if (ii >= len && continued[KEYWORD]) {
              longestSequenceFound = continued[KEYWORD]
              end = ii
              isLongerSequenceFound = true
            }

            if (isLongerSequenceFound) {
              i = end
            }
          }

          trie = this.trie._root

          if (longestSequenceFound) {
            kws.push(longestSequenceFound)
          }
        }
        else {
          trie = this.trie._root
        }
      }
      else if(trie[char]) {
        trie = trie[char]
      }
      else {
        trie = this.trie._root
        let ii = i + 1
        while(ii < len) {
          char = sentence[ii]
          if (!this.boundaries.test(char)) break
          ++ii
        }
        i = ii
      }

      if (i + 1 >= len && trie[KEYWORD]) {
        sequenceFound = trie[KEYWORD]
        kws.push(sequenceFound)
      }
      ++i
    }

    return kws;
  }

  replaceKeyWords(sentence: string) {
    if (!sentence || typeof sentence !== 'string') return sentence
    let newSenstence = []
    let originalSentence = sentence
    if (this.option.ignore) sentence = sentence.toLowerCase()
    let currentWord = ''
    let trie: any = this.trie._root
    let currentWhiteSpace = ''
    let end = 0
    let idx = 0
    let len = sentence.length

    while(idx < len) {
      let char = sentence[idx]
      currentWord += originalSentence[idx]

      let sequenceFound, longestSequenceFound, isLongerSequenceFound, idy;
      if (!this.boundaries.test(char)) {
        currentWhiteSpace = char
        if (trie[KEYWORD] || trie[char]) {

          if(trie[KEYWORD]) {
            sequenceFound = longestSequenceFound = trie[KEYWORD]
            end = idx
          }

          if(trie[char]) {
            let trieContinue = trie[char]
            let wordContinue = currentWord
            idy = idx + 1
            while (idy < len) {
              let _char = sentence[idy]
              wordContinue += originalSentence[idy]
              if (!this.boundaries.test(_char) && trieContinue[KEYWORD]) {
                currentWhiteSpace = _char
                longestSequenceFound = trieContinue[KEYWORD]
                end = idy
                isLongerSequenceFound = 1
              }
              if (trieContinue[_char]) {
                trieContinue = trieContinue[_char]
              }
              else break

              idy++
            }

            if (idy >= len && trieContinue[KEYWORD]) {
              currentWhiteSpace = ''
              longestSequenceFound = trieContinue[KEYWORD]
              end = idy
              isLongerSequenceFound = 1
            }

            if (isLongerSequenceFound) {
              idx = end
              currentWord = wordContinue
            }
          }

          trie = this.trie._root

          if (longestSequenceFound) {
            newSenstence.push(longestSequenceFound + currentWhiteSpace)
            currentWord = ''
            currentWhiteSpace = ''
          }
          else {
            newSenstence.push(currentWord)
            currentWord = ''
            currentWhiteSpace = ''
          }
        }
        else {
          trie = this.trie._root
          newSenstence.push(currentWord)
          currentWord = ''
          currentWhiteSpace = ''
        }
      }
      else if (trie[char]) {
        trie = trie[char]
      }
      else {  
        trie = this.trie._root
        idy = idx + 1
        while (idy < len) {
          let _char = sentence[idy]
          currentWord += originalSentence[idy]
          if (!this.boundaries.test(_char)) break
          idy++
        }
        idx = idy
        newSenstence.push(currentWord)
        currentWord = ''
        currentWhiteSpace = ''
      }

      if (idx + 1 >= len) {
        if(trie[KEYWORD]) {
          sequenceFound = trie[KEYWORD]
          newSenstence.push(sequenceFound)
        }
        else {
          newSenstence.push(currentWord)
        }
      }
      idx++
    }

    return newSenstence.join('')
  }

  clear() {
    this.trie.clear()
  }
}

export const flashtext = new FlashText()
