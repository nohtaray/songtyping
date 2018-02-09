import React from 'react';

/**
 * @param charPos {number}
 * @param keys {string}
 * @returns {*}
 */
export default ({charPos, keys}) => {
  return (
      <div className="keys_box">
        <span className="keys_done">
          {keys.slice(0, charPos).toUpperCase()}
        </span>
        <span className="keys_remains">
          {keys.slice(charPos).toUpperCase()}
        </span>
      </div>
  );
};
