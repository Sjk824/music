<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner" ref="barInner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"  ref="progressBtn" 
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
  export default {
    props: {
      percent: 0
    },
    computed: {
      barWidth() {
        return this.$refs.barInner.clientWidth;
      }
    },
    methods: {
      progressClick(e) {
        const translateX = e.pageX - this.$refs.barInner.getBoundingClientRect().left,
          initPercent = translateX / this.barWidth,
          percent = initPercent < 0
            ? 0
            : initPercent > 1
              ? 1
              : initPercent;
        this.setPlaying(true);
        this.$emit('progress', percent);
      },
      progressTouchStart(e) {
        if(e.touches.length > 1) {
          return;
        };
        this.translateX = null;
        this.touching = true;
      },
      progressTouchMove(e) {
        if(!this.touching) {
          return;
        }
        const translateX = e.touches[0].pageX - this.$refs.barInner.getBoundingClientRect().left;
        if( ( translateX > 0 ) && ( translateX < this.barWidth ) ) {
          this.translateX = translateX;
        }else if(translateX < 0) {
          this.translateX = 0;
        }else {
          this.translateX = this.barWidth;
        }
        this.$refs.progress.style.transform = `scaleX(${this.translateX / this.barWidth})`;
        this.$refs.progressBtn.style.transform = `translateX(${this.translateX}px)`;
      },
      progressTouchEnd(e) {
        if(!this.touching || this.translateX == null) {
          this.touching = false;
          return;
        }
        this.$emit('progress', this.translateX / this.barWidth);
        this.touching = false;
      },
      ...mapMutations({
        setPlaying: 'SET_PLAYING'
      })
    },
    watch: {
      percent(val) {
        if(this.touching){
          return;
        };
        this.$refs.progress.style.transform = `scaleX(${val})`;
        this.$refs.progressBtn.style.transform = `translateX(${val * this.barWidth}px)`;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      margin: 0 12px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        width: 100%
        transform-origin: left
        transform: scaleX(0)
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -14px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>