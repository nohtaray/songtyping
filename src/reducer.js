import {
  ACCEPT_STROKE, BEGIN_WORD, COMPLETE_LOAD_LYRIC, FINISH_WORD, LYRIC_TRANSITION,
  REJECT_STROKE,
} from './actions';

export default (state = {
  allLyrics: [],
  lyrics: [],
  kanaPoses: [0, 0, 0, 0],
  rowPos: 0,
  keys: '',
  keyPos: 0,

  audioSrc: '/audio/romeo_and_cinderella.mp3',
}, action) => {
  switch (action.type) {
    case COMPLETE_LOAD_LYRIC:
      return {
        ...state,
        allLyrics: action.payload,
      };
    case LYRIC_TRANSITION:
      const page = action.payload;
      return {
        ...state,
        lyrics: Object.assign([], state.allLyrics[page].lyrics),
      };

    case BEGIN_WORD:
      return {
        ...state,
        keys: action.payload.keys,
      };

    case ACCEPT_STROKE:
    case REJECT_STROKE:
    case FINISH_WORD:
      const {keyPos, kanaPos, keys} = action.payload;
      const kanaPoses = state.kanaPoses.slice();
      kanaPoses[state.rowPos] = kanaPos;

      return {
        ...state,
        keyPos,
        keys,
        kanaPoses,
      };
    default:
      return state;
  }
}
