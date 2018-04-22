<template>
    <TypeWrapper :form="form">
        <el-input v-model="model" slot="input" :placeholder="form.placeholder" :disabled="form.readonly">
        </el-input>
    </TypeWrapper>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "StringType",
    mounted() {},
    mixins: [Type],
    props: [],
    data() {
        return {};
    },
};
</script>


<style scoped>

</style>
