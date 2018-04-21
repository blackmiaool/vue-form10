<template>
    <div class="hello">
        <el-form-item :label="form.title">
            <AnyType v-for="(item,key) in form.properties" :key="key" :form="item" :model.sync="modelThis[key]"/>
        </el-form-item>
    </div>
</template>

<script>
import AnyType from "./AnyType";

console.log(111, AnyType);
export default {
    name: "ObjectType",
    beforeCreate() {
        // eslint-disable-next-line
        this.$options.components.AnyType = require("./AnyType").default;
    },
    computed: {
        modelThis: {
            set(value) {
                this.$emit('update:model', value);
            },
            get() {
                return this.model;
            }
        },
    },
    mounted() {
        console.log("objecttype", this.form, this.model);
    },
    props: ["form", "model"],
    data() {
        return {};
    },
    components: { }
};
</script>


<style scoped>

</style>
