<template>
  <div ref="suggest"
    class="suggest noscroll-bar"
    @scroll="scroll"
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
      <loading v-show="hasMore" ref="hasMore"></loading>
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
  import {filterSinger,createSong} from 'common/js/song';
  import Singer from 'common/js/singer';
  import {mapMutations,mapGetters,mapActions} from 'vuex';

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
        pageIndex: 1,
        onSearching: false
      };
    },
    computed: {
      ...mapGetters([
        'playList',
        'currentIndex'
      ])
    },
    methods: {
      scroll() {
        if(!this.hasMore || this.onSearching)return;
        const topPos = this.$refs.hasMore.$el.offsetTop - this.$refs.suggest.scrollTop;
        if(topPos < this.$refs.suggest.clientHeight) {
          this.searchQuery();
        }
      },
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
        } else {
          this.selectSong(item);
        }
      },
      searchQuery() {
        this.onSearching = true;
        search(this.query, this.pageIndex, true, PER_PAGE).then((res) => {
          if(res.code === ERR_OK){
            const zhida = res.data.zhida;
            let s = [];
            if(zhida.type === TYPE_SINGER && this.pageIndex === 1) {
              s[0] = zhida;
            }
            if(res.data.song.list.length < PER_PAGE) {
              this.hasMore = false;
            } else {
              this.hasMore = true;
            }
            if(this.pageIndex === 1) {
              // 确保pageIndex为1时得到的得到的数据不受之前的this.result的影响
              this.result = s.concat(res.data.song.list);
            } else {
              this.result = this.result.concat(s.concat(res.data.song.list));
            }
          }
          //请求成功后再增加this.pageIndex，确保在有网络错误的情况下this.pageIndex的正确
          this.pageIndex = this.pageIndex + 1;
          this.onSearching = false;
        }).catch(() => {
          this.onSearching = false;
        });
      },
      selectSong(item) {
        let cIndex;
        const hasSong = this.playList.some((song, index) => {
          if(song.id === item.songid) {
            cIndex = index;
            return true;
          }
        });
        if(hasSong) {
          this.setCurrentIndex(cIndex);
          return;
        }
        const song = createSong(item),
          newPlayList = this.playList.slice();
          newPlayList.splice(this.currentIndex + 1, 0, song);
        this.selectPlay({
          list: newPlayList,
          index: this.currentIndex + 1
        });
      },
      ...mapMutations({
        setSinger: 'SET_SINGER',
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      query(val) {
        this.pageIndex = 1;
        if(val !== ''){
          this.searchQuery();
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
    overflow: auto
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