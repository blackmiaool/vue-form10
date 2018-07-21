<template>
    <el-form>
        <div v-for="(format,i) in formats" :key="i" class="format-list">

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{$t(format.form10.format.name)}}</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                <AnyTypePreview :plugin="format" />
            </el-card>
        </div>
    </el-form>
</template>

<script>
import Form10 from "./Form10";
import AnyTypePreview from "./AnyTypePreview";

export default {
    name: "FormatList",
    computed: {
        formats() {
            return this.plugins.filter(plugin => {
                return plugin.form10 && plugin.form10.format;
            });
        }
    },
    methods: {},
    mounted() {},
    props: ["plugins"],
    components: {
        Form10,
        AnyTypePreview
    }
};
</script>
<style lang="less">
.format-list{
    .el-card__header{
        padding:8px 12px;
    }
    .el-card__body{
        padding:10px;
    }
}
</style>
<style scoped lang="less">
.box-card{
    margin-bottom: 10px;
}
</style>

