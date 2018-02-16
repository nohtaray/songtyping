import {createAction} from 'redux-actions';

export const PUSH_START_BUTTON = '@@app/PUSH_START_BUTTON';
export const START_GAME = '@@app/START_GAME';

export const OTHERS_ACCEPT_STROKE = '@@app/OTHERS_ACCEPT_STROKE';

export const ACCEPT_STROKE = '@@app/ACCEPT_STROKE';
export const REJECT_STROKE = '@@app/REJECT_STROKE';
export const BEGIN_WORD = '@@app/BEGIN_WORD';
export const FINISH_WORD = '@@app/FINISH_WORD';

export const CAN_PLAY_THROUGH_AUDIO = '@@app/CAN_PLAY_THROUGH_AUDIO';
export const COMPLETE_LOAD_LYRIC = '@@app/COMPLETE_LOAD_LYRIC';
export const LYRIC_TRANSITION = '@@app/LYRIC_TRANSITION';

export const pushStartButton = createAction(
    PUSH_START_BUTTON,
);
export const startGame = createAction(
    START_GAME,
    ({playerCount, playerNumber, seed}) => ({playerCount, playerNumber, seed}),
);

export const othersAcceptStroke = createAction(
    OTHERS_ACCEPT_STROKE,
    ({kanaPos, rowPos}) => ({kanaPos, rowPos}),
);

export const acceptStroke = createAction(
    ACCEPT_STROKE,
    ({keyPos, kanaPos, keys}) => ({keyPos, kanaPos, keys}),
);
export const rejectStroke = createAction(
    REJECT_STROKE,
    ({keyPos, kanaPos, keys}) => ({keyPos, kanaPos, keys}),
);
export const beginWord = createAction(
    BEGIN_WORD,
    ({keys}) => ({keys}),
);
export const finishWord = createAction(
    FINISH_WORD,
    ({keyPos, kanaPos, keys}) => ({keyPos, kanaPos, keys}),
);

export const canPlayThroughAudio = createAction(
    CAN_PLAY_THROUGH_AUDIO,
    audio => audio,
);
export const completeLoadLyric = createAction(
    COMPLETE_LOAD_LYRIC,
    lyrics => lyrics,
);
export const lyricTransition = createAction(
    LYRIC_TRANSITION,
    page => page,
);