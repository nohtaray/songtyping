import React from 'react';

/**
 * @param content {string}
 * @returns {*}
 */
const ChatPost = ({content}) => {
  return (
      <div className="chat_post">
        {content}
      </div>
  );
};

/**
 * @param contents {string[]}
 * @returns {*}
 */
export default ({contents}) => {
  const posts = contents.map((content) => {
    return <ChatPost content={content} />
  });

  return (
      <div className="chat_timeline">
        {posts}
      </div>
  )
};