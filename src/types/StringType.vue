<template>
    <div class="hello">
        <el-form-item :label="form.title">
            <el-input v-model="model">
            </el-input>
            <span v-if="form.description" class="form10-description">
                {{form.description}}
            </span>
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
