import {
  ACCEPT_STROKE, BEGIN_WORD, COMPLETE_LOAD_LYRIC, FINISH_WORD, LYRIC_TRANSITION,
  OTHERS_ACCEPT_STROKE,
  REJECT_STROKE, START_GAME,
} from './actions';
import xorshift from 'xorshift';

const ArrayShuffle = seed => {
  const xs = xorshift.constructor([362436069, 521288629, 88675123, seed]);
  return arr => {
    [...Array(arr.length)].forEach((_, i) => {
      const r = Math.floor(xs.random() * arr.length);
      [arr[r], arr[i]] = [arr[i], arr[r]];
    });
    return arr;
  };
};

const assign = (lyrics, playerCount, seed) => {
  const shuffle = ArrayShuffle(seed);
  return lyrics.map((page) => {
    const players = shuffle([...Array(playerCount)].map((_, i) => i));
    const assigns = page.lyrics.map((_, i) => players[i % playerCount]);
    return shuffle(assigns);
  });
};

function nextRowPos(pageAssignments, playerNumber, typedRowCount) {
  return [0, 1, 2, 3].filter(
      k => pageAssignments[k] === playerNumber,
  )[typedRowCount];
}

export default (state = {
  allLyrics: [],
  lyrics: [],
  page: 0,
  kanaPoses: [0, 0, 0, 0],
  rowPos: 0,
  kana: '',
  keys: '',
  keyPos: 0,

  playerNumber: null,
  assignments: [],
  typedRowCount: 0,

  audioSrc: '/audio/romeo_and_cinderella.mp3',
}, action) => {
  switch (action.type) {
    case COMPLETE_LOAD_LYRIC:
      return {
        ...state,
        allLyrics: action.payload,
      };
    case START_GAME: {
      const {playerCount, playerNumber, seed} = action.payload;
      return {
        ...state,
        playerNumber,
        assignments: assign(state.allLyrics, playerCount, seed),
      };
    }
    case LYRIC_TRANSITION: {
      const page = action.payload;
      const lyrics = Object.assign([], state.allLyrics[page].lyrics);
      const typedRowCount = 0;
      const rowPos = nextRowPos(
          state.assignments[page],
          state.playerNumber,
          typedRowCount,
      );
      return {
        ...state,
        page,
        lyrics,
        rowPos,
        kana: lyrics[rowPos] ? lyrics[rowPos].hiragana : '',
        keyPos: 0,
        kanaPoses: [0, 0, 0, 0],
        keys: '',
        typedRowCount,
      };
    }
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
      const typedRowCount = state.typedRowCount + 1;
      const rowPos = nextRowPos(
          state.assignments[state.page],
          state.playerNumber,
          typedRowCount,
      );
      return {
        ...state,
        keyPos: 0,
        keys: '',
        kana: lyrics[rowPos] ? lyrics[rowPos].hiragana : '',
        rowPos,
        typedRowCount,
      };
    }

    case OTHERS_ACCEPT_STROKE: {
      const {kanaPos, rowPos} = action.payload;
      const kanaPoses = state.kanaPoses.slice();
      kanaPoses[rowPos] = kanaPos;

      return {
        ...state,
        kanaPoses,
      };
    }
    default:
      return state;
  }
}
