import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import 'normalize.css';
import './index.css';
import {Game} from './game.jsx';

const audioSrc = '/audio/romeo_and_cinderella.mp3';
const lyricSrc = '/lyric/romeo_and_cinderella.xml';

class AudioPlayer extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.audio = null;
  }

  handleCanPlayThrough() {
    // this.audio.play();
  }

  render() {
    return (
        <div>
          <audio
              src={this.props.src}
              onCanPlayThrough={() => this.handleCanPlayThrough()}
              ref={ref => {this.audio = ref;}}>
          </audio>
        </div>
    );
  }
}



// ========================================

ReactDOM.render(
    (
        <div>
          <AudioPlayer src={audioSrc} />
          <Game lyricSrc={lyricSrc} />
        </div>
    ),
    document.getElementById('root'),
);
