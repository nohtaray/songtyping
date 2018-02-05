import React from 'react';
import LyricRowHiragana from './LyricRowHiragana';
import LyricRowKanji from './LyricRowKanji';

/**
 * @param hiragana {string}
 * @param kanji {string}
 * @param charPos {number}
 * @returns {*}
 */
export default ({hiragana, kanji, charPos}) => {
  return (
      <div className="lyric_row">
        <LyricRowHiragana
            hiragana={hiragana}
            charPos={charPos} />
        <LyricRowKanji
            kanji={kanji} />
      </div>
  );
}
