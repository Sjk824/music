<template>
  <div class="search" ref="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="changeQuery"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <div ref="shortcut" class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="selectHot(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="clearItems">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-history :searchHistory="searchHistory" @select="selectItem" @delete="deleteItem"></search-history>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" :query="query"></suggest>
    </div>
    <confirm ref="confirm" :text="'确定要清空搜索历史吗？'" :confirmBtnText="'确定'" :cancelBtnText="'取消'" @cancle="cancleClear" @confirm="confirmClear"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import Confirm from 'base/confirm';
  import SearchBox from 'base/search-box';
  import {ERR_OK} from 'api/config';
  import Suggest from 'components/suggest/suggest';
  import SearchHistory from 'components/search-history/search-history';
  import {getHotKey} from 'api/search';
  import {playListMixin} from 'common/js/mixin';
  import {mapGetters,mapActions} from 'vuex';

  export default {
    mixins: [playListMixin],
    data() {
      return {
        query: '',
        hotKey: []
      };
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    created() {
      getHotKey().then((res) => {
        if(res.code === ERR_OK){
          this.hotKey = res.data.hotkey.slice(0,10);
        }
      });
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.search.style.bottom = bottom;
      },
      selectHot(hotTitle) {
        this.$refs.searchBox.setQuery(hotTitle);
      },
      changeQuery(val) {
        this.query = val;
        if(val.trim() === '')return;
        this.addSearchHistory(val);
      },
      clearItems() {
        this.$refs.confirm.showFlag = true;
      },
      selectItem(item) {
        this.$refs.searchBox.setQuery(item);
      },
      deleteItem(index) {
        this.deleteSearchHistory(index);
      },
      cancleClear() {
        this.$refs.confirm.showFlag = false;
      },
      confirmClear() {
        this.$refs.confirm.showFlag = false;
        this.clearSearchHistory();
      },
      ...mapActions([
        'addSearchHistory',
        'clearSearchHistory',
        'deleteSearchHistory'
      ])
    },
    components: {
      Confirm,
      SearchBox,
      Suggest,
      SearchHistory
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    position: absolute
    top: 88px
    bottom: 0
    left: 0
    right: 0
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: absolute
      top: 90px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: absolute
      width: 100%
      top: 90px
      bottom: 0
</style>