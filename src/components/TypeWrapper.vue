<template>
    <el-form-item :label="(hideTitle||form.notitle)?'':form.title">
        <slot name="input">
        </slot>
        <span v-if="form.description" class="form10-description">
            {{form.description}}
        </span>
    </el-form-item>
</template>

<script>

export default {
    name: "TypeWrapper",
    mixins: [],
    mounted() {
    },
    props: { form: {}, options: {}, 'hide-title': { type: Boolean } },
    data() {
        return {};
    }
};
</script>


<style scoped>
.form10-description{
    line-height: 20px;
    font-size: 14px;
    vertical-align: baseline;
    color:#737373;
}
</style>
