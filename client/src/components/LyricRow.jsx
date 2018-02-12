import React from 'react';

/**
 * @param kanji {string}
 * @returns {*}
 */
const LyricRowKanji = ({kanji}) => {
  return (
      <div className="lyric_row_kanji">
        {kanji}
      </div>
  );
};

/**
 * @param charPos {number}
 * @param hiragana {string}
 * @returns {*}
 */
const LyricRowHiragana = ({charPos, hiragana}) => {
  return (
      <div className="lyric_row_hiragana">
        <span className="lyric_done">{hiragana.slice(0, charPos)}</span>
        <span className="lyric_remains">{hiragana.slice(charPos)}</span>
      </div>
  );
};


/**
 * @param hiragana {string}
 * @param kanji {string}
 * @param kanaPos {number}
 * @param color {string}
 * @returns {*}
 */
export default ({hiragana, kanji, kanaPos, color}) => {
  return (
      <div className={`lyric_row color_${color}`}>
        <LyricRowHiragana
            hiragana={hiragana}
            charPos={kanaPos} />
        <LyricRowKanji
            kanji={kanji} />
      </div>
  );
}
