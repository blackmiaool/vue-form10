<template>
  <div id="app">
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  components: {
    HelloWorld,
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
