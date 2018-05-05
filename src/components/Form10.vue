<template>
    <div class="vue-form10">
        <el-form>
            <AnyType
                :sf-model.sync="model"
                :sf-form="form"
                :options="this.options"
            ></AnyType>
        </el-form>
    </div>
</template>

<script>
import AnyType from "./AnyType";

export default {
    name: "Form10",

    mounted() {
        const schema = this.sfSchema;
        // console.log("schema", schema, this.sfOptions, this.$parent);
        // const context = this.$parent;
        // for (const i in context) {
        //     console.log(i, context[i]);
        // }
        if (schema.type === "object") {
            this.compForm = schema;
        }
    },
    provide() {
        return { options: this.sfOptions, rootModel: this.model };
    },
    computed: {
        options() {
            const options = {
                $rootParent: this.$parent,
            };
            if (this.sfOptions) {
                Object.assign(options, this.sfOptions);
            }
            return options;
        },
        model: {
            set(value) {
                this.$emit("update:sf-model", value);
            },
            get() {
                return this.sfModel;
            }
        },
        form() {
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
