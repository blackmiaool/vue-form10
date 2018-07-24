<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <el-input :type="type==='textarea'?'textarea':'text'"
            v-model="model" slot="input" :placeholder="form.placeholder"
            :disabled="schema.readOnly">
        </el-input>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";

export default {
    name: "string-default",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: 'string',
            types: ['string'],
        },
    },
};
</script>


<style scoped>

</style>
