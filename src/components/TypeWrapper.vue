<template>
    <el-form-item :label="(hideTitle||form.notitle)?'':form.title"
        style="margin-bottom:15px;" :class="[form.htmlClass]" :error="errorMessage" ref="formItem" >
        <div style="clear:both;">
            <slot name="input">
            </slot>
        </div>
        <span v-if="form.description" class="form10-description">
            {{form.description}}
        </span>
    </el-form-item>
</template>

<script>
export default {
    name: "TypeWrapper",
    mixins: [],
    mounted() {},
    props: { form: {}, options: {}, "hide-title": { type: Boolean } },
    data() {
        return {
            errorMessage: ''
        };
    }
};
</script>


<style scoped>
.form10-description {
    line-height: 20px;
    font-size: 14px;
    vertical-align: baseline;
    color: #737373;
}
</style>
