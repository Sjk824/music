import * as types from './mutation-types';
import {playMode} from 'common/js/config';

export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING, true);
};

export const selectRondomPlay = function({commit, state}, list) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_CURRENT_INDEX, Math.floor(Math.random() * list.length) );
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING, true);
  commit(types.SET_MODE, playMode.random);
};
