<template>
    <TypeWrapper :form="form">
        <el-select v-model="model" :placeholder="form.placeholder" slot="input" clearable :disabled="form.readonly">
            <el-option v-for="(item,index) in form.schema.enum" :key="index"
                :label="item" :value="item">
            </el-option>
        </el-select>
    </TypeWrapper>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "EnumType",
    mounted() {
        console.log(this);
    },
    mixins: [Type],
    props: [],
    data() {
        return {};
    }
};
</script>


<style scoped>

</style>
