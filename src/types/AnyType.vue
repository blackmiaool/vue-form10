<template>
    <div class="hello">
        <component :is="componentId" :form="form" :model.sync="modelThis"></component>
    </div>
</template>

<script>
import ObjectType from "./ObjectType";
import StringType from "./StringType";

export default {
    name: "AnyType",
    computed: {
        modelThis: {
            set(value) {
                this.$emit('update:model', value);
            },
            get() {
                return this.model;
            }
        },
        componentId() {
            const form = this.form;
            console.log("any type form", form, form.type);
            if (form.type === "object") {
                return "ObjectType";
            } else if (form.type === "string") {
                return "StringType";
            } else if (form.type === "number") {
                return "StringType";
            }
            return "label";
        }
    },
    mounted() {},
    props: ["form", "model", "options"],
    data() {
        return {
            compForm: {}
        };
    },
    components: { ObjectType, StringType }
};
</script>


<style scoped>

</style>
