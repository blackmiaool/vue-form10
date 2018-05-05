<template>
    <component v-if="condition" :is="componentId"
        :sf-form="sfForm" :sf-model.sync="model"
        :options="options" :name="name"></component>

</template>

<script>
import ObjectType from "../types/ObjectType";
import StringType from "../types/StringType";
import NumberType from "../types/NumberType";
import BooleanType from "../types/BooleanType";
import SelectType from "../types/SelectType";
import TimestampType from "../types/TimestampType";
import ArrayType from "../types/ArrayType";
import { stdFormObj } from '../mixins/type';

export default {
    name: "AnyType",
    mixins: [],
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
        form() {
            const form = stdFormObj(this.name, this.sfForm);
            if (form.schema.format) {
                form.type = form.schema.format;
            }
            if (this.sfForm['x-schema-form']) {
                Object.assign(form, this.sfForm['x-schema-form']);
            }
            return form;
        },
        model: {
            set(value) {
                this.$emit('update:sfModel', value);
            },
            get() {
                return this.sfModel;
            }
        },
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
    props: ['sf-model', 'sf-form', "options", "name"],
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
