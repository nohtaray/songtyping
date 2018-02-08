import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {canPlayThroughAudio} from '../actions';

class AudioPlayer extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    onCanPlayThrough: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.audio = null;
  }

  render() {
    const {src, onCanPlayThrough} = this.props;

    return (
        <div>
          <audio
              src={src}
              onCanPlayThrough={() => onCanPlayThrough(this.audio)}
              ref={ref => {this.audio = ref;}}>
          </audio>
        </div>
    );
  }
}

export default connect(
    state => ({
      src: state.audioSrc,
    }),
    dispatch => ({
      onCanPlayThrough: audio => dispatch(canPlayThroughAudio(audio)),
    })
)(AudioPlayer);