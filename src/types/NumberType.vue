<template>
    <TypeWrapper :form="form">
        <el-input-number v-model="model" slot="input" :disabled="form.readonly">
        </el-input-number>
    </TypeWrapper>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "NumberType",
    mixins: [Type],
};
</script>
