<template>
  <transition name="slide">
    <music-list :songs="songs" :title="disc.dissname" :bgImage="disc.imgurl"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex';
import {getDiscSongList} from 'api/recommend';
import {ERR_OK} from 'api/config';
import {createSong} from 'common/js/song';
import MusicList from 'components/music-list/music-list';

  export default {
    computed: {
      ...mapGetters([
        'disc'
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
        if(!this.disc || !this.disc.dissid){
          this.$router.push('/recommend');
          return;
        }
        getDiscSongList(this.disc.dissid).then((res) => {
          if(res.code === ERR_OK){
            this.songs = this._normalizeSongs(res.cdlist[0].songlist);
          }
        });
      },
      _normalizeSongs(list) {
        let songs = [];
        list.forEach((musicData) => {
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