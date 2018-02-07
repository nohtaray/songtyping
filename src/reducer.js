import {
  ACCEPT_STROKE, BEGIN_WORD, COMPLETE_LOAD_LYRIC, FINISH_WORD, LYRIC_TRANSITION,
  REJECT_STROKE,
} from './actions';

export default (state = {
  allLyrics: [],
  lyrics: [],
  page: 0,
  kanaPoses: [0, 0, 0, 0],
  rowPos: 0,
  kana: '',
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
      const lyrics = Object.assign([], state.allLyrics[page].lyrics);
      const rowPos = 0;
      return {
        ...state,
        page,
        lyrics,
        rowPos,
        kana: lyrics[rowPos] ? lyrics[rowPos].hiragana : '',
        keyPos: 0,
        kanaPoses: [0, 0, 0, 0],
        keys: '',
      };

    case BEGIN_WORD:
      return {
        ...state,
        keys: action.payload.keys,
      };
    case ACCEPT_STROKE:
    case REJECT_STROKE: {
      const {keyPos, kanaPos, keys} = action.payload;
      const kanaPoses = state.kanaPoses.slice();
      kanaPoses[state.rowPos] = kanaPos;

      return {
        ...state,
        keyPos,
        keys,
        kanaPoses,
      };
    }
    case FINISH_WORD: {
      const lyrics = state.allLyrics[state.page].lyrics;
      const rowPos = state.rowPos + 1;
      return {
        ...state,
        keyPos: 0,
        keys: '',
        kana: lyrics[rowPos] ? lyrics[rowPos].hiragana : '',
        rowPos,
      };
    }
    default:
      return state;
  }
}
