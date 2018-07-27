<template>
    <el-form-item :label="(hideTitle||form.notitle)?'':$t(form.title)"
        :style="{margin}" :class="{[schema.htmlClass]:true,'el-form-item-full-width':schema.fullWidth}"
        :required="schema.required===true"
        ref="formItem">
        <div style="clear:both;">
            <slot name="input">
            </slot>
        </div>
        <span v-if="schema.description" class="form10-description">
            {{schema.description}}
        </span>
    </el-form-item>
</template>

<script>
export default {
    name: "TypeWrapper",
    computed: {
        style() {
            const ret = { margin: this.margin };
            if (this.schema.fullWidth) {
                ret.display = "block;";
            }
            return ret;
        }
    },
    props: { form: {}, options: {}, "hide-title": { type: Boolean }, margin: {}, schema: {} }
};
</script>

<style lang="less">
.el-form-item-full-width{
    display: block !important;
    >.el-form-item__content{
        display: block !important;
    }
}
</style>
<style scoped>
.form10-description {
    line-height: 20px;
    font-size: 14px;
    vertical-align: baseline;
    color: #737373;
}
</style>
