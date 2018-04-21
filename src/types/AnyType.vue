<template>
    <div class="hello">
        <component :is="componentId"
        :sf-form="sfForm"
        :sf-model.sync="model"
        :options="options"
        :name="name"
        ></component>
    </div>
</template>

<script>
import ObjectType from "./ObjectType";
import StringType from "./StringType";
import Type from "../mixins/type";

export default {
    name: "AnyType",
    mixins: [Type],
    computed: {
        componentId() {
            const form = this.form;
            const type = form.type || form.schema.type;
            if (type === "object") {
                return "ObjectType";
            } else if (type === "string") {
                return "StringType";
            } else if (type === "number") {
                return "StringType";
            }
            return "label";
        }
    },
    mounted() {},
    props: [],
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
