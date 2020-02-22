import FlashText from '../src';

const KEYWORD = '__FlashText.js__'
describe('FlashText unit test', () => {

  let ft: FlashText

  beforeEach(() => ft = new FlashText())

  describe('#addKeyWord', () => {
    const kw = 'abc'
    const target = {a: {b: {c: {[KEYWORD]: 'abc'}}}}
    it('should add nothing', () => {
      ft.addKeyWord('')
      expect(ft.size).toBe(0)
      expect(ft._trie._root).toEqual({})
    });

    it('should works via addKeyWord', () => {
      ft.addKeyWord(kw);
      expect(ft.size).toBe(1)
      expect(ft._trie._root).toEqual(target)
    })

    it('should works well with another same value', () => {
      ft.addKeyWord(kw);
      ft.addKeyWord(kw);
      expect(ft.size).toBe(1)
      expect(ft._trie._root).toEqual(target)
    })

    const _target = {
      a: {
        b: {
          c: {[KEYWORD]: 'abc'},
          e: {[KEYWORD]: 'abe'}
        }
      }
    }

    it('should works well with another difference value', () => {
      ft.addKeyWord(kw);
      ft.addKeyWord('abe');
      expect(ft.size).toBe(2)
      expect(ft._trie._root).toEqual(_target)
    })
  })

  describe('#addKeyWordsFromArray', () => {
    const kws = ['abc', 'abe']
    const target = {
      a: {
        b: {
          c: {[KEYWORD]: 'abc'},
          e: {[KEYWORD]: 'abe'}
        }
      }
    }
    it('should works via addKeyWordsFromArray', () => {
      ft.addKeyWordsFromArray(kws);
      expect(ft.size).toBe(2)
      expect(ft._trie._root).toEqual(target)
    })
  })

  describe('#addKeyWordsFromObject', () => {
    const kws = {
      'abc': ['ABC', 'abc']
    }
    const target = {
      a: {
        b: {
          c: {[KEYWORD]: 'abc'}
        }
      },
      A: {
        B: {
          C: {[KEYWORD]: 'abc'}
        }
      }
    }
    it('should works via addKeyWordsFromObject', () => {
      ft.addKeyWordsFromObject(kws);
      expect(ft.size).toBe(2)
      expect(ft._trie._root).toEqual(target)
    })
  })

  describe('#removeKeyWord', () => {
    it('should remove nothing', () => {
      ft.addKeyWord('abc')
      ft.removeKeyWord('anything')

      expect(ft.size).toBe(1)
      expect(ft._trie._root).toEqual({a: {b: {c: {[KEYWORD]: 'abc'}}}})
    })

    it('should remove correctly', () => {
      ft.removeKeyWord('abc')
      expect(ft.size).toBe(0)
      expect(ft._trie._root).toEqual({})
    })
  })

  describe('#removeKeyWordsFromArray', () => {
    it('should remove nothing', () => {
      ft.addKeyWord('abc')
      ft.removeKeyWordsFromArray([])

      expect(ft.size).toBe(1)
      expect(ft._trie._root).toEqual({a: {b: {c: {[KEYWORD]: 'abc'}}}})
    })

    it('should remove correctly', () => {
      ft.removeKeyWordsFromArray(['abc'])
      expect(ft.size).toBe(0)
      expect(ft._trie._root).toEqual({})
    })
  })

  describe('#get, #toMap', () => {
    it('should get the matched string', () => {
      ft.addKeyWord('abc', 'hello');
      expect(ft.get('abc')).toBe('hello')
    })

    it('should get the mapped object', () => {
      ft.addKeyWord('abc', 'hello');
      ft.addKeyWord('abe', 'world');
      expect(ft.toMap()).toEqual({abc: 'hello', abe: 'world'})
    })
  })

  describe('#extractKeywords', () => {
    const target = 'I love Big Apple and Bay Area.'
    it('should extract the keyword from the target string correctly', () => {
      ft.addKeyWord('Big Apple', 'New York')
      ft.addKeyWord('Bay Area')
      expect(ft.extractKeywords(target)).toEqual(['New York', 'Bay Area'])
    })

    const another = 'I love Big Apple and Bay Area.'
    it('should extract the keyword from the target string correctly', () => {
      ft = new FlashText({ignore: true})
      ft.addKeyWord('big apple', 'New York')
      ft.addKeyWord('Bay Area')
      expect(ft.extractKeywords(another)).toEqual(['New York', 'Bay Area'])
    })
  })

  describe('#replaceKeyWords', () => {
    const target = 'I love Big Apple and New Delhi.'
    it('should replace the keyword with mapped string correctly', () => {
      ft.addKeyWord('New Delhi', 'NCR region');
      expect(ft.replaceKeyWords(target)).toBe('I love Big Apple and NCR region.')
    })

    it('should replace the keyword with mapped string correctly', () => {
      const target = 'I love Big Apple and New Delhi.'
      ft = new FlashText({ignore: true})
      ft.addKeyWord('new Delhi', 'NCR region');
      expect(ft.replaceKeyWords(target)).toBe('I love Big Apple and NCR region.')
    })
  })
});
