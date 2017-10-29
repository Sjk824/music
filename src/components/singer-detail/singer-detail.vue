<template>
  <transition name="slide">
    <music-list :songs="songs" :title="singer.name" :bgImage="singer.avatar"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex';
import {getSingerDetail} from 'api/singer';
import {ERR_OK} from 'api/config';
import {createSong} from 'common/js/song';
import MusicList from 'components/music-list/music-list';

  export default {
    computed: {
      ...mapGetters([
        'singer'
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
        if(!this.singer.id){
          this.$router.push('/singer');
          return;
        }
        return getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK){
            this.songs = this._normalizeSongs(res.data.list);
          }
        });
      },
      _normalizeSongs(list) {
        let songs = [];
        list.forEach(({musicData}) => {
          if (musicData.songid && musicData.albummid){
            songs.push(createSong(musicData));
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