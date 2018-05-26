<template>
    <component v-if="condition" :is="componentId"
        :sf-form="sfForm" :sf-model.sync="model"
        :parent="parent" :path="path" :options="options"
        :name="name" :is-last="isLast"></component>

</template>

<script>
import { mapState } from "vuex";
import ObjectType from "../plugins/ObjectType";
import StringType from "../plugins/StringType";
import NumberType from "../plugins/NumberType";
import BooleanType from "../plugins/BooleanType";
import ArrayType from "../plugins/ArrayType";
import { stdFormObj } from "../mixins/type";

export default {
    name: "AnyType",
    mixins: [],
    methods: {
        remove(destroyStrategy) {
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
            this.remove(destroyStrategy);
        }
    },
    computed: {
        ...mapState({
            rootModel: state => state.model
        }),
        form() {
            const form = stdFormObj(this.name, this.sfForm);
            if (form.schema.format) {
                form.type = form.schema.format;
            }
            if (this.sfForm["x-schema-form"]) {
                Object.assign(form, this.sfForm["x-schema-form"]);
            }
            return form;
        },
        model: {
            set(value) {
                this.$emit("update:sfModel", value);
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
            if (form.type) {
                const result = this.options.formats.find(({ name }) => name === form.type);
                if (result) {
                    return `format-${result.name}`;
                }
            }
            const type = form.type || form.schema.type;

            if (type === "object") {
                return "ObjectType";
            } else if (type === "string") {
                if (form.schema.enum) {
                    return "SelectFormat";
                }
                return "StringType";
            } else if (type === "number") {
                return "NumberType";
            } else if (type === "array") {
                return "ArrayType";
            } else if (type === "boolean") {
                return "BooleanType";
            } else if (type === "textarea") {
                return "StringType";
            }
            console.error(`unknown format `, this.sfForm, type, this);

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
        },
        path() {
            let ret;
            if (this.parent === "root") {
                ret = this.parentPath.concat([]);
            } else {
                ret = this.parentPath.concat([this.name]);
            }
            return ret;
        }
    },
    beforeMount() {
        this.options.formats.forEach(({ name, component }) => {
             this.$options.components[`format-${name}`] = component;
        });
    },
    props: [
        "sf-model",
        "sf-form",
        "options",
        "name",
        "parent",
        "is-last",
        "parent-path"
    ],
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
        ArrayType
    }
};
</script>


<style scoped>

</style>
