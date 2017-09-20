<template>
  <div class="singer">
    我是singer
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer';
  import {ERR_OK} from 'api/config';

  const HOT_SINGER_LEN = 10;
  const HOT_NAME = '热门';

  export default {
    data() {
      return {
        singerList: []
      };
    },
    created() {
      this._getSingerList();
    },
    methods: {
      _getSingerList() {
        getSingerList().then( (res) => {
          if(res.code === ERR_OK){
            this.singerList = this._normalizeSinger(res.data.list);
            console.log(res.data.list,this.singerList);
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
      }
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