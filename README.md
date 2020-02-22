# flashtext.js

Extract Keywords from sentence or Replace keywords in sentences.

> [flashtext's ](https://github.com/vi3k6i5/flashtext) implementation via typescript.

> read [regex-was-taking-5-days-flashtext-does-it-in-15-minutes](https://www.freecodecamp.org/news/regex-was-taking-5-days-flashtext-does-it-in-15-minutes-55f04411025f/) to learn more.

*if you should match over 500 keywords, flashtext will better tha regexp, otherwise you may not need it*

## Usage

```js
npm install flashtextjs
yarn add flashtextjs
```

then

```js
// FlashText is the Class, flashtext is the instance with default option
import FlashText, { flashtext } from 'flashtextjs';
// if you want to ignore case, use let ft = new FlashText({ignore: true});


// extract keywords from a target string
const target = 'I love Big Apple and Bay Area.'
ft.addKeyWord('Big Apple', 'New York')
ft.addKeyWord('Bay Area')
ft.extractKeywords(target) // output: ['New York', 'Bay Area']

// replace the string via keywords
const target = 'I love Big Apple and New Delhi.'
ft.addKeyWord('New Delhi', 'NCR region');
ft.replaceKeyWords(target) // output: 'I love Big Apple and NCR region.'
```

## API

- **ft.addKeyWord(keyword: string, mapped?: string)**

add the keyword in trie structure. when the keyword matched in the target string, will return secode param mapped.

mapped default is equal to keyword string.

```js
ft.addKeyWord('New Delhi', 'NCR region');
ft.get('New Delhi'); // output 'NCR region'

ft.extractKeywords('I love Big Apple and Bay Area.') // output: ['NCR region']
```

- **addKeyWordsFromArray(keywords: string[], mapped?: string)**

as the name

```js
ft.addKeyWordsFromArray(['jack rose'])
```

- **ft.addKeyWordsFromObject(object)**

the object must like this structure: { 'mapped': [] }

```js
ft.addKeyWordsFromObject({'jack rose': ['jack roses', 'jack ros']});

// means when matched 'jack roses' or 'jack ros', will return 'jack rose'
```

- **ft.removeKeyWord(keyword: string)**

will remove the keyword in the trie structure

-**ft.removeKeyWordsFromArray(keywords: string[])**

just `forEach(() => removeKeyWord())`

- **ft.toMap()**

will return a keyword-mapped mapper.

```js
ft.addKeyword('abc', 'ABC');
ft.addKeyword('abd', 'ABC');

ft.toMap(); // output {abc: 'ABC', abd: 'ABC'}
```

- **ft.extractKeywords(target: string)**

will return all the matched keywords in an arry

```js
// extract keywords from a target string
const target = 'I love Big Apple and Bay Area.'
ft.addKeyWord('Big Apple', 'New York')
ft.addKeyWord('Bay Area')
ft.extractKeywords(target) // output: ['New York', 'Bay Area']
```

- **ft.replaceKeyWords(target: string)**

will replace the target string with keywords and return it.

```js
// replace the string via keywords
const target = 'I love Big Apple and New Delhi.'
ft.addKeyWord('New Delhi', 'NCR region');
ft.replaceKeyWords(target) // output: 'I love Big Apple and NCR region.'
```

more api, just go [here](./src/flashtext.ts)

## License

[MIT](./LICENSE)