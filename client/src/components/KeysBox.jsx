import React from 'react';

/**
 * @param charPos {number}
 * @param keys {string}
 * @param color {string}
 * @returns {*}
 */
export default ({charPos, keys, color}) => {
  return (
      <div className={`keys_box color_${color}`}>
        <span className="keys_done">
          {keys.slice(0, charPos).toUpperCase()}
        </span>
        <span className="keys_remains">
          {keys.slice(charPos).toUpperCase()}
        </span>
      </div>
  );
};
