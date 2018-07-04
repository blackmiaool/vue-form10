<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <div slot="input" style="width:100%;">
            <el-input-number v-model="model" :disabled="form.readonly" :min="form.minimum===undefined?-Infinity:form.minimum" :max="form.maximum===undefined?Infinity:form.maximum">
            </el-input-number>
        </div>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";

export default {
    name: "NumberType",
    mixins: [FormatMixin],
    form10: {
        type: 'number',
    },
};
</script>
