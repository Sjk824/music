<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner" ref="barInner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script>
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
      progressClick() {},
      progressTouchStart() {},
      progressTouchMove() {},
      progressTouchEnd() {}
    },
    watch: {
      percent(val) {
        this.$refs.progress.style.transform = `scaleX(${val})`;
        console.log(this.barWidth);
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
      margin: 0 6px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        width: 100%
        transform-origin: left
        transform: scaleX(1)
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