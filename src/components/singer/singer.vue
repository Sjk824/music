<template>
  <div class="singer" ref="singer">
    <Listview :data="singerList" @select="selectSinger"></Listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer';
  import {ERR_OK} from 'api/config';
  import Listview from '../listview/listview';
  import {playListMixin} from 'common/js/mixin';
  import {mapMutations} from 'vuex';

  const HOT_SINGER_LEN = 10;
  const HOT_NAME = '热';

  export default {
    mixins: [playListMixin],
    data() {
      return {
        singerList: []
      };
    },
    created() {
      this._getSingerList();
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
      },
      selectSinger(singer) {
        this.setSinger(singer);
        this.$router.push({
          path: `/singer/${singer.id}`
        });
      },
      _getSingerList() {
        getSingerList().then( (res) => {
          if(res.code === ERR_OK){
            this.singerList = this._normalizeSinger(res.data.list);
          }
        });
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        list.forEach((item,index) => {
          if(index < HOT_SINGER_LEN){
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }));
          }
          const key = item.Findex;
          if(map[key] == null){
            map[key] = {
              title: key,
              items: []
            };
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }));
        });
        let hot = [],
          ret = [];
        for(let key in map){
          let val = map[key];
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          } else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        return hot.concat(ret);
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      Listview
    }
  };

  class Singer{
    constructor({id,name}){
      this.name = name;
      this.id = id;
      this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`;
    };
  };

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: absolute
    top: 88px
    bottom: 0
    width: 100%
</style>