export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const currentIndex = state => state.currentIndex;

export const currentSong = state => state.playList[state.currentIndex] || {};

export const discSongList = state => state.discSongList;

export const disc = state => state.disc;

export const searchHistory = state => state.searchHistory;

export const rankList = state => state.rankList;
