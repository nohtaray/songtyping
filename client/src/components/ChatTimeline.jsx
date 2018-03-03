import React from 'react';
import {PropTypes} from 'prop-types';

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
export default class extends React.Component {
  static propTypes = {
    contents: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);
    this.ref = null;
  }

  componentDidUpdate() {
    // 下までスクロール
    this.ref.scrollTop = this.ref.scrollHeight;
  }

  render() {
    const {contents} = this.props;

    const posts = contents.map((content, i) => {
      return <ChatPost key={`${i} ${content}`} content={content} />;
    });

    return (
        <div className="chat_timeline" ref={ref => this.ref = ref}>
          {posts}
        </div>
    );
  }
};
