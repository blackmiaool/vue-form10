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

<style>
#app {
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
</style>
