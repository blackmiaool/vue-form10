<template>
    <TypeWrapper :form="form"  ref="typeWrapper">
        <el-input :type="type==='textarea'?'textarea':'text'" v-model="model"
            slot="input" :placeholder="form.placeholder"
            :disabled="form.readonly">
        </el-input>
    </TypeWrapper>
</template>

<script>
import { Input } from 'element-ui';
import Type from "../mixins/type";


export default {
    name: "StringType",
    computed: {

    },
    mounted() {},
    mixins: [Type],
    props: [],
    data() {
        return {};
    },
    components: {
        'el-input': Input
    }
};
</script>


<style scoped>

</style>
