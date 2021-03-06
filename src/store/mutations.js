import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING](state, flag){
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag){
    state.fullScreen = flag;
  },
  [types.SET_PLAY_LIST](state, list){
    state.playList = list;
  },
  [types.SET_SEQUENCE_LIST](state, list){
    state.sequenceList = list;
  },
  [types.SET_MODE](state, mode){
    state.mode = mode;
  },
  [types.SET_CURRENT_INDEX](state, index){
    state.currentIndex = index;
  },
  [types.SET_DISC_SONG_LIST](state, discSongList){
    state.discSongList = discSongList;
  },
  [types.SET_DISC](state, disc){
    state.disc = disc;
  },
  [types.SET_SEARCH_HISTORY](state, searchHistory){
    state.searchHistory = searchHistory;
  },
  [types.SET_RANK_LIST](state, rankList){
    state.rankList = rankList;
  }
};

export default mutations;
