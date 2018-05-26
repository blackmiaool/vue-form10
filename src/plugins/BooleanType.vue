<template>
    <TypeWrapper :form="form" hide-title  ref="typeWrapper">
        <template slot="input">
            <el-switch v-model="model" active-color="#13ce66" inactive-color="#aaaaaa" :active-text="form.notitle?'':form.title" :disabled="form.readonly">
            </el-switch>
        </template>
    </TypeWrapper>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "BooleanType",
    mixins: [Type],
};
</script>

