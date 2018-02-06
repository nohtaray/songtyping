import {ACCEPT_STROKE, FINISH_WORD, REJECT_STROKE} from './actions';

export default (state = {
  lyrics: [
    {kanji: '私の恋を', hiragana: 'わたしのこいを'},
    {kanji: '悲劇のジュリエットにしないで', hiragana: 'ひげきのじゅりえっとにしないで'},
    {kanji: 'ここから連れ出して…', hiragana: 'ここからつれだして・・・'},
    {kanji: 'そんな気分よ', hiragana: 'そんなきぶんよ'},
  ],
  kanaPoses: [0, 0, 0, 0],
  rowPos: 0,
  keys: 'watasinocoiwo',
  keyPos: 0,
}, action) => {
  switch (action.type) {
    case ACCEPT_STROKE:
    case REJECT_STROKE:
    case FINISH_WORD:
      const {keyPos, kanaPos} = action.payload;
      const kanaPoses = state.kanaPoses.slice();
      kanaPoses[state.rowPos] = kanaPos;

      return {
        ...state,
        keyPos,
        kanaPoses: kanaPoses,
      };
    default:
      return state;
  }
}
