import {ACCEPT_STROKE, FINISH_WORD, REJECT_STROKE} from './actions';

export default (state = {
  lyrics: [
    {kanji: '私の恋を', hiragana: 'わたしのこいを'},
    {kanji: '悲劇のジュリエットにしないで', hiragana: 'ひげきのじゅりえっとにしないで'},
    {kanji: 'ここから連れ出して…', hiragana: 'ここからつれだして・・・'},
    {kanji: 'そんな気分よ', hiragana: 'そんなきぶんよ'},
  ],
  charPoses: [7, 4, 0, 0],
  keys: 'higekinozyuriettonisinaide',
  keyPos: 0,
}, action) => {
  switch (action.type) {
    case ACCEPT_STROKE:
    case REJECT_STROKE:
    case FINISH_WORD:
      return {...state, keyPos: action.payload.keyPos}
    default:
      return state;
  }
}
