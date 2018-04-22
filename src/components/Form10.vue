<template>
    <div class="vue-form10">
        <el-form>
            <AnyType
                :sf-model.sync="model"
                :sf-form="form"
                :options="this.sfOptions"
            ></AnyType>
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
        }
    },
    computed: {
        model: {
            set(value) {
                this.$emit("update:sf-model", value);
            },
            get() {
                return this.sfModel;
            }
        },
        form() {
            console.log(this.sfSchema);

            return this.compForm;
        }
    },
    props: ["sf-schema", "sf-model", "sf-form", "sf-options"],
    data() {
        return {
            componentId: "div",
            compForm: {}
        };
    },
    components: { AnyType }
};
</script>


<style scoped>

</style>
