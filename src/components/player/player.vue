<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal"
      @before-enter = "initialPosition"
      @enter = "enter"
      @after-enter = "initialPosition"
      @before-leave = "initialPosition"
      @leave = "leave"
      @after-leave = "initialPosition"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" ref="middle" 
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
        >
          <div class="middle-l" :class="{'right': showLyric}" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="normalImage">
                <img class="image" :class="rotating" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{currentLyric[currentLineNum] && currentLyric[currentLineNum].text}}</div>
            </div>
          </div>
          <scroll class="middle-r" :class="{'right': showLyric}" ref="lyricList" :data="currentLyric">
            <div class="lyric-wrapper" ref="lyricWrapper">
              <div v-if="currentLyric.length>0">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(currentLine,index) in currentLyric"
                >{{currentLine.text}}</p>
              </div>
              <div v-if="currentLyric.length===0">
                <p class="text empty">暂无歌词</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': !showLyric}"></span>
            <span class="dot" :class="{'active': showLyric}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTiming}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @progress="progressing"></progress-bar>
            </div>
            <span class="time time-r">{{durationTiming}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i  @click="pre" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i  @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" ref="miniImage" :class="rotating">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" :class="miniIcon"></i>
        </div>
        <div class="control">
          <i @click.stop="showList" class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list :showFlag="showListFlag" @hide="hideList"></play-list>
    <audio :src="currentSongUrl" ref = "audio" @canplay= "canPlay" @error="audioError" @timeupdate="timeUpdate" @ended="ended"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {prefixStyle} from 'common/js/dom';
  import Scroll from 'base/scroll';
  import ProgressBar from 'base/progress-bar';
  import {playMode} from 'common/js/config';
  import PlayList from 'components/play-list/play-list';

  const transformPrefix = prefixStyle('transform'),
    transitionPrefix = prefixStyle('transition');

  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: [],
        showLyric: false,
        showListFlag: false
      };
    },
    computed: {
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      rotating() {
        return this.playing ? 'play' : 'play pause';
      },
      disableCls() {
        return this.songReady ? '' : 'disable';
      },
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      currentTiming() {
        return this._timing(this.currentTime);
      },
      durationTiming() {
        return this._timing(this.currentSong.duration);
      },
      modeIcon() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
      },
      currentLineNum() {
        let num = 0;
        const t = this.currentLyric.some((lyricLine, index) => {
          if(lyricLine.time - 0 > this.currentTime) {
            num = index - 1;
            return true;
          }
        });
        if(!t) {
          return this.currentLyric.length - 1;
        };
        num = num === -1 ? 0 : num;
        return num;
      },
      currentSongUrl() {
        return this.currentSong.mid ? `http://isure.stream.qqmusic.qq.com/C100${this.currentSong.mid}.m4a?fromtag=32` : null;
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'playList',
        'mode',
        'currentSong',
        'currentIndex'
      ])
    },
    methods: {
      _timing(time) {
        time = time | 0;
        return this._pad((time / 60) | 0) + ':' + this._pad((time % 60) | 0);
      },
      _pad(num, n = 2) {
        num = num + '';
        let len = num.length;
        while(len < n) {
          num = '0' + num;
          len++;
        };
        return num;
      },
      back() {
        this.setFullScreen(false);
      },
      open() {
        this.setFullScreen(true);
      },
      canPlay() {
        this.songReady = true;
      },
      audioError() {
        this.songReady = true;
      },
      timeUpdate(e) {
        this.currentTime = e.target.currentTime;
      },
      transformArgs() {
        const miniRect = this.$refs.miniImage.getBoundingClientRect(),
          miniWidth = this.$refs.miniImage.clientWidth,
          miniHeight = this.$refs.miniImage.clientHeight,
          miniLeft = miniRect.left,
          miniTop = miniRect.top,
          normalRect = this.$refs.normalImage.getBoundingClientRect(),
          normalLeft = normalRect.left,
          normalTop = normalRect.top,
          normalWidth = this.$refs.normalImage.clientWidth,
          normalHeight = this.$refs.normalImage.clientHeight;

          return {
            transformX: miniLeft - normalLeft - ( normalWidth - miniWidth ) / 2,
            transformY: miniTop - normalTop - ( normalHeight - miniHeight ) / 2,
            scale: miniWidth / normalWidth
          };
      },
      enter() {
        const transformArgs = this.transformArgs();
        this.$refs.normalImage.style[transformPrefix] = `translate3d(${transformArgs.transformX}px, ${transformArgs.transformY}px, 0) scale(${transformArgs.scale})`;
        /* eslint-disable no-unused-vars */
        let rh = this.$refs.normalImage.offsetHeight;// 触发重绘
        this.$refs.normalImage.style[transitionPrefix] = 'all 0.4s linear';
        this.$refs.normalImage.style[transformPrefix] = 'translate3d( 0px, 0px, 0) scale(1)';
      },
      leave() {
        this.$nextTick(() => {
          this.$refs.normalImage.style[transformPrefix] = 'translate3d( 0px, 0px, 0) scale(1)';
          const transformArgs = this.transformArgs();
          this.$refs.normalImage.style[transitionPrefix] = 'all 0.4s linear';
          this.$refs.normalImage.style[transformPrefix] = `translate3d(${transformArgs.transformX}px, ${transformArgs.transformY}px, 0) scale(${transformArgs.scale})`;
        });
      },
      initialPosition() {
        this.$refs.normalImage.style[transitionPrefix] = '';
        this.$refs.normalImage.style[transformPrefix] = 'translate3d( 0px, 0px, 0) scale(1)';
      },
      togglePlaying() {
        this.setPlayingState(!this.playing);
      },
      pre() {
        if(!this.songReady) return;
        let index;
        if(this.currentIndex === 0) {
          index = this.playList.length - 1;
        }else {
          index = this.currentIndex - 1;
        };
        this.setCurrentIndex(index);
        if(!this.playing){
          this.togglePlaying();
        };
        this.songReady = false;
      },
      ended() {
        if(this.mode === playMode.loop) {
          this.loop();
          return;
        }else if(this.mode === playMode.random) {
          this.random();
          return;
        };
        this.next();
      },
      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      },
      random() {
        const len = this.playList.length;
        if(len === 1) {
          this.loop();
          return;
        };
        let randomIndex = Math.floor( Math.random() * (len - 1) );
        if(randomIndex >= this.currentIndex) {
          randomIndex = randomIndex + 1;
        }
        this.setCurrentIndex(randomIndex);
      },
      next() {
        if(!this.songReady) return;
        const len = this.playList.length;
        if(len === 1) {
          this.loop();
          return;
        };
        let index = this.currentIndex + 1;
        if(index === len){
          index = 0;
        };
        this.setCurrentIndex(index);
        if(!this.playing){
          this.togglePlaying();
        };
        this.songReady = false;
      },
      progressing(percent) {
        this.$refs.audio.currentTime = percent * this.currentSong.duration;
      },
      changeMode() {
        const mode = (this.mode + 1) % 3;
        this.setMode(mode);
      },
      touchstart(e) {
        this.touchInitX = e.touches[0].pageX;
        this.middleLeft = this.$refs.lyricList.$el.getBoundingClientRect().left;
        this.$refs.lyricList.$el.style[transitionPrefix] = 'transform 0s';
        this.$refs.middleL.style[transitionPrefix] = 'opacity 0s';
        this.touching = true;
      },
      touchmove(e) {
        if(!this.touching)return;
        const middleWidth = this.$refs.middleL.clientWidth,
          distanceX = e.touches[0].pageX - this.touchInitX,
          posX = distanceX + (this.middleLeft - middleWidth),
          translateX = posX < -middleWidth
            ? -middleWidth
            : posX > 0
              ? 0
              : posX;
        this.$refs.middleL.style.opacity = (middleWidth - Math.abs(translateX) ) / middleWidth;
        this.$refs.lyricList.$el.style[transformPrefix] = `translate3d(${translateX}px, 0, 0)`;
      },
      touchend(e) {
        if(!this.touching)return;
        this.$refs.lyricList.$el.style[transformPrefix] = null;
        const dis = e.changedTouches[0].pageX - this.touchInitX;
        this.$refs.lyricList.$el.style[transitionPrefix] = null;
        this.$refs.middleL.style.opacity = null;
        this.$refs.middleL.style[transitionPrefix] = null;
        this.$nextTick(() => {
          if(dis >= this.$refs.lyricList.$el.clientWidth/4) {
            this.showLyric = false;
          }
          if(dis < -this.$refs.lyricList.$el.clientWidth/4) {
            this.showLyric = true;
          }
        });
      },
      showList() {
        this.showListFlag = true;
      },
      hideList() {
        this.showListFlag = false;
      },
      _setCurrentIndex(songList) {
        songList.some((song, index) => {
          if(song.id === this.currentSong.id) {
            this.setCurrentIndex(index);
            return true;
          }
        });
      },
      _lyricFormat(lyric) {
        const reg = /\[(\d{2,3}):(\d{2})\.(\d{2})\]/g;
        const lyricList = lyric
          .match(reg)
          .map((item) => {
            return {time: item.replace(reg, (a,b,c,d) => (b - 0) * 60 + (c - 0) + (d - 0)/ 100 )};
          });
        const lyricText = lyric.split(/\[\d{2,3}:\d{2}\.\d{2}\]/g);
        for(let i = 1; i < lyricText.length; i++){
          if(!lyricList[i-1]) {
            break;
          };
          lyricList[i-1].text = lyricText[i].trim();
        };
        return lyricList;
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayList: 'SET_PLAY_LIST',
        setMode: 'SET_MODE'
      })
    },
    watch: {
      currentSong(newSong, oldSong) {
        if(newSong.id === oldSong.id) {
          return;
        };
        // 设置延时，保证从后台切换过来后还可以正常播放
        setTimeout(() => {
          if(typeof newSong.getLyric !== 'function') return;
          this.$refs.audio.play();
          newSong.getLyric().then((lyric) => {
            this.currentLyric = this._lyricFormat(lyric);
          }).catch(() => {
            this.currentLyric = [];
          });
        }, 600);
      },
      playing(val) {
        this.$nextTick(() => {
          val ? this.$refs.audio.play() : this.$refs.audio.pause();
        });
      },
      currentLineNum(val) {
        this.$nextTick(() => {
          const lines = this.$refs.lyricLine,
            lyricList = this.$refs.lyricList.$el;
          if(!lyricList || !lines || !lines[val]) {
            return;
          };
          const listHeight = lyricList.clientHeight,
            itemHeight = lines[val].clientHeight;

          if(itemHeight === 0)return;

          const wrapperHeight = this.$refs.lyricWrapper.clientHeight,
            itemTop = lines[val].offsetTop,
            itemScrollTop = listHeight / 2 - itemTop - itemHeight / 2,
            posY = itemScrollTop > 0
              ? 0
              : itemScrollTop + wrapperHeight < listHeight
                ? listHeight - wrapperHeight
                : itemScrollTop;
          this.$refs.lyricList.scrollTo(0, posY, 500);
        });
      }
    },
    components: {
      Scroll,
      ProgressBar,
      PlayList
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        transform: translateX(0)
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          transition: opacity 0.3s
          &.right
            opacity: 0
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              .play
                animation: rotate 20s linear infinite
              .pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          transition: transform 0.3s
          &.right
            transform: translate3d(-100%, 0, 0)
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>