import React from 'react';
import PropTypes from 'prop-types';

class AudioLoader extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    onLoad: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.audio = null;
  }

  handleCanPlayThrough() {
    this.props.onLoad(this.audio);
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

export {AudioLoader};
