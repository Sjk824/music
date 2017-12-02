<template>
  <transition name="slide">
    <music-list :rank="true" :songs="songs" :title="rankList.topTitle" :bgImage="rankList.picUrl"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex';
import {getMusicList} from 'api/rank';
import {ERR_OK} from 'api/config';
import {createSong} from 'common/js/song';
import MusicList from 'components/music-list/music-list';

  export default {
    computed: {
      ...mapGetters([
        'rankList'
      ])
    },
    created() {
      this._getDetail();
    },
    data(){
      return {
        songs: []
      };
    },
    methods: {
      _getDetail() {
        if(!this.rankList.id){
          this.$router.push('/rank');
          return;
        }
        return getMusicList(this.rankList.id).then((res) => {
          if(res.code === ERR_OK){
            this.songs = this._normalizeSongs(res.songlist);
          }
        });
      },
      _normalizeSongs(list) {
        let songs = [];
        list.forEach(({data}) => {
          if (data.songid && data.albummid){
            songs.push(createSong(data));
          }
        });
        return songs;
      }
    },
    components: {
      MusicList
    }
  };

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>