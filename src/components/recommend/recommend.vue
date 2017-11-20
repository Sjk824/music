<template>
  <div class="recommend" ref="recommend">
    <div class="recommend-content noscroll-bar" ref="recommendContent">
      <div v-if="recommends.length" class="slider-wrapper " ref="sliderWrapper">
        <Slider>
          <div v-for="item in recommends">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </div>
        </Slider>
      </div>
      <div class="recommend-list" v-if="discList.length">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li @click="selectItem(item)" v-for="item in discList" class="item">
            <div class="icon">
              <img width="60" height="60" v-lazy="item.imgurl">
            </div>
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname"></p>
            </div>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-if="!discList.length">
        <Loading></Loading>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getRecommend, getDiscList} from 'api/recommend';
  import {ERR_OK} from 'api/config';
  import Slider from 'base/slider';
  import Loading from 'base/loading';
  import {playListMixin} from 'common/js/mixin';
  import {mapMutations} from 'vuex';

  export default {
    mixins: [playListMixin],
    data() {
      return {
        recommends: [],
        discList: [],
        scrollY: 0
      };
    },
    created() {
      this._recommend();
      this._discList();
    },
    mounted() {
      this.$nextTick(this._listenerScroll);
    },
    activated() {
      this.$refs.recommendContent.scrollTop = this.scrollY;
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.recommend.style.bottom = bottom;
      },
      _recommend() {
        getRecommend().then( (res) => {
          if(res.code === ERR_OK){
            this.recommends = res.data.slider;
          }
        });
      },
      _discList() {
        getDiscList().then( (res) => {
          if(res.code === ERR_OK){
            this.discList = res.data.list;
          }
        });
      },
      _listenerScroll() {
        this.$refs.recommendContent.addEventListener('scroll', () => {
          this.scrollY = this.$refs.recommendContent.scrollTop;
        }, false);
      },
      selectItem(item) {
        this.setDisc(item);
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Loading
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: absolute
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow-x: hidden
      overflow-y: scroll
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>