<template>
  <div class="listview" ref="listview">
    <ul class="list-ul noscroll-bar" ref="listUl">
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li v-for="(item, index) in navigation" :data-index="index" class="item" ref="navigation"
            :class="{'current':currentIndex===index}" @touchstart="touchstart(index)">{{item}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  const HOT = '热';

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        currentIndex: 0,
        touchstartPosY: 0
      };
    },
    mounted() {
      this.$nextTick(this._listenerScroll);
    },
    computed: {
      listGroupHeight() {
        const listGroup = this.$refs.listGroup;
        let heights = [];
        for(let i = 0; i<listGroup.length; i++){
          heights.push(listGroup[i].offsetTop);
        }
        return heights;
      },
      navigation() {
        return this.data.map((item,index) => {
          return index === 0 ? HOT : item.title;
        });
      },
      navigationTop() {
        const navigation = this.$refs.navigation;
        let navigationTop = [];
        for(let i = 0; i<navigation.length; i++){
          navigationTop.push(navigation[i].getBoundingClientRect().top);
        }
        return navigationTop;
      }
    },
    methods: {
      selectItem() {},
      touchstart(index) {
        this._scroll(index);
        this._bindTouchmove();
      },
      _bindTouchmove() {
        document.addEventListener('touchmove', this._touchmove, false);
        document.addEventListener('touchend', this._offTouchEvent, false);
      },
      _touchmove(e) {
        const touchmoveY = e.touches[0].pageY;
        this.navigationTop.some((height,index) => {
          if(touchmoveY >= height && (touchmoveY < this.navigationTop[index + 1] || index === this.navigationTop.length-1) ){
            this._scroll(index);
            return true;
          }
        });
      },
      _offTouchEvent() {
        document.removeEventListener('touchmove', this._touchmove, false);
        document.removeEventListener('touchend', this._offTouchEvent, false);
      },
      _scroll(index) {
        this.currentIndex = index;
        this.$refs.listUl.scrollTop = this.listGroupHeight[index];
      },
      _listenerScroll() {
        this.$refs.listUl.addEventListener('scroll', this._calcCurrentIndex, false);
      },
      _calcCurrentIndex() {
        const scrollTop = this.$refs.listUl.scrollTop;
        this.listGroupHeight.some((height,index) => {
          if(scrollTop >= height && (scrollTop < this.listGroupHeight[index + 1] || index === this.listGroupHeight.length-1) ){
            this.currentIndex = index;
            return true;
          }
        });
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    height: 100%
    background: $color-background
    .list-ul
      position: relative
      height: 100%
      overflow-x: hidden
      overflow-y: scroll
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>