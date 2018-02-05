export default (state = {
  lyrics: [
    {kanji: '私の恋を', hiragana: 'わたしのこいを'},
    {kanji: '悲劇のジュリエットにしないで', hiragana: 'ひげきのじゅりえっとにしないで'},
    {kanji: 'ここから連れ出して…', hiragana: 'ここからつれだして・・・'},
    {kanji: 'そんな気分よ', hiragana: 'そんなきぶんよ'},
  ],
  charPoses: [7, 4, 0, 0],
  keys: 'higekinozyuriettonisinaide',
  keysPos: 10,
}, action) => {
  switch (action.type) {
    default:
      return state;
  }
}
