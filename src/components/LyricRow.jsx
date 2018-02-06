import React from 'react';
import LyricRowHiragana from './LyricRowHiragana';
import LyricRowKanji from './LyricRowKanji';

/**
 * @param hiragana {string}
 * @param kanji {string}
 * @param kanaPos {number}
 * @returns {*}
 */
export default ({hiragana, kanji, kanaPos}) => {
  return (
      <div className="lyric_row">
        <LyricRowHiragana
            hiragana={hiragana}
            charPos={kanaPos} />
        <LyricRowKanji
            kanji={kanji} />
      </div>
  );
}
