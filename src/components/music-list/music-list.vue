<template>
  <div class="music-list">
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="filter" ref="filter"></div>
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" @scroll="scroll" class="list" ref="list">
      <div class="song-list-wrapper" ref="songlist">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      <div class="loading-wrapper" v-show="songs.length === 0">
        <loading></loading>
      </div>
    </scroll>
    <div class="title-wrapper" ref="title">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
    </div>
  </div>
</template>

<script>
  import SongList from 'base/song-list';
  import Scroll from 'base/scroll';
  import {addClass,removeClass,prefixStyle} from 'common/js/dom';
  import Loading from 'base/loading';
  import {playListMixin} from 'common/js/mixin';
  import {mapActions} from 'vuex';

  const transformPrefix = prefixStyle('transform');

  export default {
    mixins: [playListMixin],
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        songListStartTop: 0,
        probeType: 3,
        listenScroll: true,
        titleHeight: 40
      };
    },
    mounted() {
      this.songListStartTop = this.$refs.bgImage.clientHeight;
      this.$refs.list.$el.style.top = this.songListStartTop + 'px';
      this.$refs.layer.style.top = this.songListStartTop + 'px';
    },
    computed: {
      bgStyle() {
        return `background: url(${this.bgImage}) 0 0 / cover no-repeat`;
      }
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.list.$el.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      back() {
        this.$router.back();
      },
      random() {
        this.selectRondomPlay(this.songs);
      },
      scroll(pos) {
        if(pos.y + this.songListStartTop <= this.titleHeight){
          addClass(this.$refs.title, 'cover');
        }else{
          removeClass(this.$refs.title, 'cover');
        }
        if(pos.y > 0){
          const per = 1 + pos.y / this.songListStartTop;
          this.$refs.bgImage.style[transformPrefix] = `scale(${per})`;
          this.$refs.layer.style[transformPrefix] = `translate3d(0px, ${pos.y}px, 0)`;
        }
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        });
      },
      ...mapActions([
        'selectPlay',
        'selectRondomPlay'
      ])
    },
    components: {
      SongList,
      Scroll,
      Loading
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .title-wrapper
      position: absolute
      top: 0
      height: 40px
      width: 100%
      &.cover
        background-color: $color-background
      .back
        position: absolute
        top: 0
        left: 6px
        .icon-back
          display: block
          padding: 10px
          font-size: $font-size-large-x
          color: $color-theme
      .title
        position: absolute
        top: 0
        left: 10%
        width: 80%
        no-wrap()
        text-align: center
        line-height: 40px
        font-size: $font-size-large
        color: $color-text
    .bg-image
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      box-sizing: border-box
      top: 0
      bottom: 0
      width: 100%
      .song-list-wrapper
        padding: 20px 30px
        background: $color-background
    .loading-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>