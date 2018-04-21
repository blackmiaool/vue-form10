<template>
    <div class="hello">
        <el-form-item :label="form.title">
            <el-input v-model="modelThis"></el-input>
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: "StringType",
    mounted() {},
    computed: {
        modelThis: {
            set(value) {
                this.$emit('update:model', value);
            },
            get() {
                return this.model;
            }
        }
    },
    props: ['form', 'model'],
    data() {
        return {};
    }
};
</script>


<style scoped>

</style>
