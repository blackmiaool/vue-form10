<template>
    <div class="hello">
        <el-form-item :label="form.title">
            <el-input v-model="model"></el-input>
        </el-form-item>
    </div>
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
    }
};
</script>


<style scoped>

</style>
