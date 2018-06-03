<template>
    <TypeWrapper :form="form" ref="typeWrapper">
        <el-input :type="type==='textarea'?'textarea':'text'"
            v-model="model" slot="input" :placeholder="form.placeholder"
            :disabled="form.readonly">
        </el-input>
    </TypeWrapper>
</template>

<script>
import { Input } from "element-ui";

export default {
    name: "StringType",
    form10: {
        type: "string",
        form: {
            placeholder: {
                title: 'placeholder',
                type: 'string',
            }
        }
    },
    components: {
        "el-input": Input
    }
};
</script>


<style scoped>

</style>
