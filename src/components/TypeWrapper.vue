<template>
    <el-form-item :label="(hideTitle||form.notitle)?'':form.title" style="margin-bottom:10px;">        
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
