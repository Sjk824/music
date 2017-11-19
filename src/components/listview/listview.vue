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
    <div class="list-fixed" ref="fixedTitle" v-show="navigation.length">
      <div class="fixed-title">{{navigation[currentIndex]}}</div>
    </div>
    <div class="list-shortcut">
      <ul>
        <li v-for="(item, index) in navigation" :data-index="index" class="item" ref="navigation"
            :class="{'current':currentIndex===index}" @touchstart.prevent="touchstart(index)">{{item}}
        </li>
      </ul>
    </div>
    <div class="loading-container" v-if="!navigation.length">
      <Loading></Loading>
    </div>
  </div>
</template>

<script>
  import Loading from 'base/loading';
  const HOT = '热',
    TITLE_HEIGHT = 29;

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
        scrollY: 0
      };
    },
    mounted() {
      this.$nextTick(this._listenerScroll);
    },
    activated() {
      this.$refs.listUl.scrollTop = this.scrollY;
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
    watch: {
      scrollY(val) {
        const fixedTitle = this.$refs.fixedTitle;
        if(this.currentIndex === this.listGroupHeight.length - 1){
          fixedTitle.style.top = '0px';
          return;
        }
        // -1是为了确保位于边界的时候也能正常展示，点击右侧导航条会scroll到边界
        if( val >= this.listGroupHeight[this.currentIndex] - 1 && val < this.listGroupHeight[this.currentIndex+1] - 1 - TITLE_HEIGHT){
          fixedTitle.style.top = '0px';
        }else{
          fixedTitle.style.top = this.listGroupHeight[this.currentIndex+1] - val -TITLE_HEIGHT + 'px';
        }
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item);
      },
      touchstart(index) {
        this._changePosition(index);
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
            this._changePosition(index);
            return true;
          }
        });
      },
      _offTouchEvent() {
        document.removeEventListener('touchmove', this._touchmove, false);
        document.removeEventListener('touchend', this._offTouchEvent, false);
      },
      _changePosition(index) {
        this.currentIndex = index;
        this.$refs.listUl.scrollTop = this.listGroupHeight[index];
        this.scrollY = this.listGroupHeight[index]; // 记录当前滚动的位置
      },
      _listenerScroll() {
        this.$refs.listUl.addEventListener('scroll', this._calcCurrentIndex, false);
      },
      _calcCurrentIndex() {
        const scrollTop = this.$refs.listUl.scrollTop;
        this.scrollY = scrollTop; // 记录当前滚动的位置
        this.listGroupHeight.some((height,index) => {
          // -1是为了确保位于边界的时候也能正常展示，点击右侧导航条会scroll到边界
          if(scrollTop >= height - 1 && (scrollTop < this.listGroupHeight[index + 1] - 1 || index === this.listGroupHeight.length-1) ){
            this.currentIndex = index;
            return true;
          }
        });
      }
    },
    components: {
      Loading
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    height: 100%
    overflow: hidden
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