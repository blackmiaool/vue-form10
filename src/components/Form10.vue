<template>
    <div class="hello">
        <el-form>
            <AnyType :model.sync="modelThis" :form="compForm" :options="this.sfOptions"></AnyType>
        </el-form>
    </div>
</template>

<script>
import AnyType from "../types/AnyType";

export default {
    name: "Form10",
    mounted() {
        const schema = this.sfSchema;
        console.log("schema", schema);
        if (schema.type === "object") {
            this.compForm = schema;
            console.log("!");
        }
    },
    computed: {
        modelThis: {
            set(value) {
                this.$emit("update:model", value);
            },
            get() {
                return this.sfModel;
            }
        },
    },
    props: ["sf-schema", "sf-model", "form", "sf-options"],
    data() {
        return {
            componentId: "div",
            compForm: {},
            model: {}
        };
    },
    components: { AnyType }
};
</script>


<style scoped>

</style>
