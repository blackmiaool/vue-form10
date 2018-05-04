<template>
    <component v-if="condition" :is="componentId"
        :sf-form="sfForm" :sf-model.sync="model"
        :options="options" :name="name"></component>

</template>

<script>
import Type from "../mixins/type";
import ObjectType from "./ObjectType";
import StringType from "./StringType";
import NumberType from "./NumberType";
import BooleanType from "./BooleanType";
import SelectType from "./SelectType";
import TimestampType from "./TimestampType";
import ArrayType from "./ArrayType";

export default {
    name: "AnyType",
    mixins: [Type],
    inject: ["rootModel"],
    watch: {
        condition(v, p) {
            if (!(p === true && v === false)) {
                return;
            }
            let destroyStrategy;
            if (this.form.destroyStrategy) {
                destroyStrategy = this.form.destroyStrategy;
            } else {
                destroyStrategy = "remove";
            }
            switch (destroyStrategy) {
                case "retain":
                    break;
                case "null":
                    this.model = null;
                    break;
                case "empty":
                    switch (this.form.schema.type) {
                        case "string":
                            this.model = "";
                            break;
                        case "object":
                            this.model = {};
                            break;
                        case "array":
                            this.model = [];
                            break;
                        default:
                        // treat as remove
                    }
                // eslint-disable-next-line
                case "remove":
                    this.model = undefined;
                    this.$emit("remove");
                    break;
                default:
                    console.warn("invalid destroyStrategy:", destroyStrategy);
                    break;
            }
        }
    },
    computed: {
        componentId() {
            const form = this.form;
            if (!this.sfForm || !Object.keys(this.sfForm).length) {
                return null;
            }
            const type = form.type || form.schema.type;
            if (type === "object") {
                return "ObjectType";
            } else if (type === "string") {
                if (form.schema.enum) {
                    return "SelectType";
                }
                return "StringType";
            } else if (type === "select") {
                return "SelectType";
            } else if (type === "number") {
                return "NumberType";
            } else if (type === "array") {
                return "ArrayType";
            } else if (type === "boolean") {
                return "BooleanType";
            } else if (type === "timestamp") {
                return "TimestampType";
            } else if (type === "textarea") {
                return "StringType";
            }
            console.error(`can't decide the type of `, this.sfForm, type, this);

            return "label";
        },
        condition() {
            let ret;
            if (this.form.condition) {
                // eslint-disable-next-line
                ret = new Function("model", `return ${this.form.condition};`)(
                    this.rootModel
                );
            } else {
                ret = true;
            }
            return ret;
        }
    },
    mounted() {},
    props: [],
    data() {
        return {
            compForm: {}
        };
    },
    components: {
        ObjectType,
        StringType,
        BooleanType,
        NumberType,
        SelectType,
        TimestampType,
        ArrayType
    }
};
</script>


<style scoped>

</style>
