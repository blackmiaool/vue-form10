<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <el-input :type="type==='textarea'?'textarea':'text'"
            v-model="model" slot="input" :placeholder="form.placeholder"
            :disabled="form.readonly">
        </el-input>
    </TypeWrapper>
</template>

<script>
export default {
    name: "StringType",
    form10: {
        type: "string",
        form: {
            placeholder: {
                title: 'placeholder',
                type: 'string',
            }
        }
    },
};
</script>


<style scoped>

</style>
