<template>
    <TypeWrapper :form="form"  ref="typeWrapper">
        <div slot="input" style="width:100%;">
            <el-input-number v-model="model" :disabled="form.readonly" :min="form.minimum===undefined?-Infinity:form.minimum" :max="form.maximum===undefined?Infinity:form.maximum">
            </el-input-number>
        </div>
    </TypeWrapper>
</template>

<script>
import { InputNumber } from 'element-ui';

export default {
    name: "NumberType",
    form10: {
        type: 'number',
    },
    components: {
        'el-input-number': InputNumber
    }
};
</script>
