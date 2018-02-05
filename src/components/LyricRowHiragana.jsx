import React from 'react';

/**
 * @param charPos {number}
 * @param hiragana {string}
 * @returns {*}
 */
export default ({charPos, hiragana}) => {
  return (
      <div className="lyric_row_hiragana">
        <span className="lyric_done">{hiragana.slice(0, charPos)}</span>
        <span className="lyric_remains">{hiragana.slice(charPos)}</span>
      </div>
  );
};

