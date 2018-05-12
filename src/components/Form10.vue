<template>
    <el-form class="vue-form10">
        <AnyType :key="uid" :sf-model.sync="model"
            :sf-form="form" :options="this.options"></AnyType>
    </el-form>
</template>

<script>
import AnyType from "./AnyType";

export default {
    name: "Form10",

    mounted() {
        const schema = this.sfSchema;

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
                $rootParent: this.$parent
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
    watch: {
        form: {
            deep: true,
            handler() {
                this.uid++;
            }
        }
    },
    props: ["sf-schema", "sf-model", "sf-form", "sf-options"],
    data() {
        return {
            uid: 0,
            componentId: "div",
            compForm: {}
        };
    },
    components: { AnyType }
};
</script>


<style scoped>

</style>
