import { FlashTextOpt, KEYWORD } from './flashtext'

export default class Trie {
  private size: number
  private root: any
  private readonly opt: FlashTextOpt

  constructor(opt: FlashTextOpt) {
    this.size = 0
    this.root = {}
    this.opt = opt
  }

  get length() {
    return this.size
  }

  get _root() {
    return this.root
  }

  private __formatter(kw: string) {
    this.opt.ignore && (kw = kw.toLowerCase())
    return kw
  }

  insert(kw: string, mapped?: string) {
    if (!kw) return false
    if (!mapped) mapped = kw

    kw = this.__formatter(kw)
    let node = this.root
    for (const w of kw) {
      !node[w] && (node[w] = {})
      node = node[w]
    }

    if (!node[KEYWORD]) {
      this.size++
      node[KEYWORD] = mapped
      return true
    }

    return false
  }

  del(kw: string) {
    if (kw) {
      const list: any = []
      const node = this.traverse(kw, (w: string, n: object) => list.push([w, n]))

      if (node && node[KEYWORD]) {
        for (const [key2remove, pointer] of list.reverse()) {
          const len = Object.keys(pointer).length
          if (len === 1) pointer[key2remove] = null
          else {
            pointer[key2remove] = null
            break
          }
        }
        this.size--
        return true
      }
    }

    return false
  }

  traverse(kw: string, cb?: Function) {
    if (!kw) return
    kw = this.__formatter(kw)
    let node = this.root
    for (const w of kw) {
      node = node[w]
      if (node) cb && cb(w, node)
      else return
    }

    return node
  }

  toMap(sofar: string = '', root: any = this.root) {
    let map: any = {}
    for (let k in root) {
      if (k === KEYWORD) map[sofar] = root[k]
      else {
        const sub = this.toMap(sofar + k, root[k])
        for (let j in sub) map[j] = sub[j]
      }
    }

    return map
  }

  get(kw: string) {
    let len = 0
    const node = this.traverse(kw, () => len++)

    if (node && node[KEYWORD] && len === kw.length) return node[KEYWORD]
  }

  contains(kw: string) {
    let len = 0
    const node = this.traverse(kw, () => len++)

    return node && node[KEYWORD] && len === kw.length
  }

  clear() {
    this.size = 0
    this.root = {}
  }
}