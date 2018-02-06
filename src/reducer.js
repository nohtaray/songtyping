import {ACCEPT_STROKE, BEGIN_WORD, FINISH_WORD, REJECT_STROKE} from './actions';

export default (state = {
  lyrics: [
    {kanji: '私の恋を', hiragana: 'わたしのこいを'},
    {kanji: '悲劇のジュリエットにしないで', hiragana: 'ひげきのじゅりえっとにしないで'},
    {kanji: 'ここから連れ出して…', hiragana: 'ここからつれだして・・・'},
    {kanji: 'そんな気分よ', hiragana: 'そんなきぶんよ'},
  ],
  kanaPoses: [0, 0, 0, 0],
  rowPos: 0,
  keys: '',
  keyPos: 0,
}, action) => {
  switch (action.type) {
    case BEGIN_WORD:
      return {
        ...state,
        keys: action.payload.keys,
      };

    case ACCEPT_STROKE:
    case REJECT_STROKE:
    case FINISH_WORD:
      const {keyPos, kanaPos, keys} = action.payload;
      const kanaPoses = state.kanaPoses.slice();
      kanaPoses[state.rowPos] = kanaPos;

      return {
        ...state,
        keyPos,
        keys,
        kanaPoses: kanaPoses,
      };
    default:
      return state;
  }
}
