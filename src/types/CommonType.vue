<template>
    <el-form-item :label="form.title">
        <slot name="input">
            <el-input v-model="model">
            </el-input>
        </slot>
    </el-form-item>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "CommonType",
    mixins: [Type],
    data() {
        return {};
    }
};
</script>
