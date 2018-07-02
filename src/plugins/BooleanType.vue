<template>
    <TypeWrapper v-bind="typeWrapperProps" hide-title  ref="typeWrapper">
        <template slot="input">
            <el-switch v-model="model" active-color="#13ce66" inactive-color="#aaaaaa" :active-text="form.notitle?'':form.title" :disabled="form.readonly">
            </el-switch>
        </template>
    </TypeWrapper>
</template>

<script>
import { Switch } from "element-ui";

export default {
    name: "BooleanType",
    form10: {
        type: 'boolean',
    },
    components: {
        'el-switch': Switch
    }
};
</script>

