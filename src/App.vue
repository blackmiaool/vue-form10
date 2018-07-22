<template>
  <div id="app">
    <Home/>
  </div>
</template>

<script>
import Home from './components/Home';

export default {
  name: 'App',
  components: {
    Home,
  },
};
</script>

<style lang="less">
html,body{
    margin: 0;
    padding:0;
    height:100%;
}

#app {
    height:100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
}
.el-form-item{
    margin-bottom: 10px;
}
.vue-form10 .el-form-item__content{
    line-height: 25px;
}
.vue-form10  .el-form-item__label{
    line-height: 25px;
}
legend{
    margin-bottom: 0 !important;
}
.rag-card{
    .el-card__header{
        padding:8px 12px;
    }
    .el-card__body{
        padding:10px;
    }
}
</style>
