<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
  const THROTTLE_TIME = 500;
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: '',
        throttle: null,
        immediately: false
      };
    },
    methods: {
      clear() {
        this.query = '';
      },
      setQuery(query) {
        this.immediately = true;
        this.query = query;
      },
      searchQuery() {
        if (this.throttle) {
          clearTimeout(this.throttle);
        }
        if (this.immediately || this.query.trim() === '') {
          this._searching();
          this.immediately = false;
          return;
        }
        this.throttle = setTimeout(() => {
          this._searching();
        }, THROTTLE_TIME);
      },
      _searching() {
        this.$emit('query', this.query.trim());
        this.throttle = null;
      }
    },
    watch: {
      query() {
        this.searchQuery();
      }
    }
    // created() {
    //   this.$watch('query', () => {
    //     this.$emit('query');
    //   });
    // }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>