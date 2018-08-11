<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <template slot="input">
            <el-switch v-model="model" active-color="#13ce66" inactive-color="#aaaaaa" :disabled="schema.readOnly" :style="{margin:options.inline?'6px 0':'0'}">
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
            name: "boolean",
            types: ["boolean"]
        }
    },
    beforeMount() {
        if (!this.model || typeof this.model !== "boolean") {
            this.model = false;
        }
    }
};
</script>
<style scoped lang="less">
& .el-form-item__content {
    display: flex;
    align-items: center;
}
</style>

