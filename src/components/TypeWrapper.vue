<template>
    <el-form-item :label="(hideTitle||form.notitle)?'':$t(title)" :style="{margin}" :class="{[schema.htmlClass]:true,'el-form-item-full-width':schema.fullWidth}" :required="schema.required===true" ref="formItem" :label-width="options.inline?'':'auto'">
        <!-- <div style="clear:both;"> -->
        <slot name="input">
        </slot>
        <!-- </div> -->
        <pre v-if="schema.description" class="form10-description">{{schema.description}}</pre>
    </el-form-item>
</template>

<script>
export default {
    name: "TypeWrapper",
    inject: ["options"],
    computed: {
        title() {
            if (this.schema.title) {
                return this.schema.title;
            }
            if (typeof this.name === "number") {
                return undefined;
            }
            return this.name;
        },
        style() {
            const ret = { margin: this.margin };
            if (this.schema.fullWidth) {
                ret.display = "block;";
            }
            return ret;
        }
    },
    props: { form: {}, "hide-title": { type: Boolean }, margin: {}, schema: {} }
};
</script>

<style lang="less">
.el-form-item-full-width {
    display: block !important;
    > .el-form-item__content {
        display: block !important;
    }
}
</style>
<style scoped>
.form10-description {
    margin: 0;
    line-height: 20px;
    font-size: 14px;
    vertical-align: baseline;
    color: #737373;
}
</style>
