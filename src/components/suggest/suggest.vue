<template>
  <div ref="suggest"
    class="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="select(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getItemName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
    </div>
  </div>
</template>

<script>
  const TYPE_SINGER = 2,
    PER_PAGE = 20;

  import Loading from 'base/loading';
  import {ERR_OK} from 'api/config';
  import {search} from 'api/search';
  import {filterSinger} from 'common/js/song';
  import Singer from 'common/js/singer';
  import {mapMutations} from 'vuex';

  export default {
    props: {
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        result: [],
        hasMore: true,
        pageIndex: 1
      };
    },
    methods: {
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
      },
      getItemName(item) {
        if(item.type === TYPE_SINGER) {
          return item.singername;
        }
        return `${filterSinger(item.singer)} - ${item.songname}`;
      },
      select(item) {
        if(item.type === TYPE_SINGER) {
          this.setSinger(new Singer(item.singermid, item.singername));
          this.$router.push({
            path: `/search/${item.singerid}`
          });
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    watch: {
      query(val) {
        if(val === '') {
          this.result = [];
        } else {
          search(this.query, this.pageIndex, true, PER_PAGE).then((res) => {
            if(res.code === ERR_OK){
              const zhida = res.data.zhida;
              let s = [];
              if(zhida.type === TYPE_SINGER) {
                s[0] = zhida;
              }
              this.result = s.concat(res.data.song.list);
            }
          });
        }
      }
    },
    components: {
      Loading
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>