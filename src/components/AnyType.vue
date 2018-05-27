<template>
    <component v-if="condition" :is="componentId"
        :sf-form="sfForm" :sf-model.sync="model"
        :parent="parent" :path="path" :options="options"
        :name="name" :is-last="isLast"></component>

</template>

<script>
import { mapState } from "vuex";
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
            let result;
            result = this.options.formats.find(({ shouldUse }) => {
                if (shouldUse && shouldUse(this.form, this.form.schema)) {
                    return true;
                }
                return false;
            });
            if (result) {
                return `format-${result.name}`;
            }
            if (form.type) {
                result = this.options.formats.find(({ name, shouldUse }) => {
                    console.log(name, shouldUse);
                    if (shouldUse && shouldUse(this.form, this.form.schema)) {
                        return true;
                    }
                    return name === form.type;
                });
                if (result) {
                    return `format-${result.name}`;
                }
                console.error(`unknown format `, this.sfForm, form.type, this);
            }
            return `type-${form.schema.type}`;
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
        Object.assign(this.$options.components, this.options.compMap);
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
    }
};
</script>


<style scoped>

</style>
