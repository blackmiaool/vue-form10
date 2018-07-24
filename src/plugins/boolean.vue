<template>
    <TypeWrapper v-bind="typeWrapperProps" hide-title  ref="typeWrapper">
        <template slot="input">
            <el-switch v-model="model" active-color="#13ce66" inactive-color="#aaaaaa" :active-text="form.notitle?'':form.title" :disabled="schema.readOnly">
            </el-switch>
        </template>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";

export default {
    name: "boolean-default",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: 'boolean',
            types: ['boolean'],
        },
    },
    beforeMount() {
        if (!this.model || typeof this.model !== 'object') {
            this.model = false;
        }
    },
};
</script>

