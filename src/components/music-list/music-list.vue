<template>
  <div class="music-list">
    <div class="bg-layer" ref="layer"></div>
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="song-list-wrapper noscroll-bar" ref="songlist" @touchstart="touchStart">
      <song-list :songs="songs"></song-list>
    </div>
  </div>
</template>

<script>
import SongList from 'base/song-list';

  export default {
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
      }
    },
    data() {
      return {
        songListTop: 0,
        touchPosY: 0,
        songListStartTop: 0
      };
    },
    mounted() {
      this.songListStartTop = this.$refs.bgImage.clientHeight;
      this.$refs.songlist.style.top = this.songListStartTop + 'px';
    },
    computed: {
      bgStyle() {
        return `background: url(${this.bgImage}) 0 0 / cover no-repeat`;
      }
    },
    methods: {
      back() {},
      random() {},
      scroll() {},
      selectItem() {},
      touchStart(e) {
        if(parseInt(this.$refs.songlist.style.top) > 0){
          e.preventDefault();
          this.touchPosY = e.touches[0].pageY;
          this.songListTop = parseInt(this.$refs.songlist.style.top);
          document.addEventListener('touchmove', this._touchmove, false);
          document.addEventListener('touchend', this._offTouchEvent, false);
        }
      },
      _touchmove(e) {
        const moveY = e.touches[0].pageY - this.touchPosY;
        console.log(e.touches[0].pageY, this.songListTop + moveY);
        this.$refs.songlist.style.top = this.songListTop + moveY + 'px';
      },
      _offTouchEvent(e) {
        document.removeEventListener('touchmove', this._touchmove, false);
        document.removeEventListener('touchend', this._offTouchEvent, false);
      }
    },
    components: {
      SongList
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
    .song-list-wrapper
      position: absolute
      box-sizing: border-box
      padding: 20px 30px
      top: 0
      bottom: 0
      width: 100%
      overflow-y: scroll
      background: $color-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>