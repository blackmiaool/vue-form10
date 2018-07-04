<template>
    <TypeWrapper v-bind="typeWrapperProps" hide-title  ref="typeWrapper">
        <template slot="input">
            <el-switch v-model="model" active-color="#13ce66" inactive-color="#aaaaaa" :active-text="form.notitle?'':form.title" :disabled="form.readonly">
            </el-switch>
        </template>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";

export default {
    name: "BooleanType",
    mixins: [FormatMixin],
    form10: {
        type: 'boolean',
    },
};
</script>

