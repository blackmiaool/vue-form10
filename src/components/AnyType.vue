<template>
    <div class="wrap" :class="{selected:isEqual(selected,path)}"
        @click.stop="onClick">
        <component v-if="condition" :is="componentId"
            :sf-schema="sfSchema" :sf-model.sync="model"
            :parent="parent" :path="path" :options="options"
            :name="name" :margin="margin"></component>
    </div>
</template>

<script>
import { mapState } from "vuex";
import get from "lodash/get";
import isEqual from "lodash/isEqual";

export function stdFormObj(name, schema, options) {
    // from json-schema-form-core
    options = options || {};

    // The Object.assign used to be a angular.copy. Should work though.
    const f = options.global && options.global.formDefaults ? Object.assign({}, options.global.formDefaults) : {};

    if (!schema) {
        return f;
    }

    if (options.global && options.global.supressPropertyTitles === true) {
        f.title = schema.title;
    } else {
        f.title = schema.title || name;
    }

    if (schema.description) {
        f.description = schema.description;
    }
    if (options.required === true || schema.required === true) {
        f.required = true;
    }
    if (schema.maxLength) {
        f.maxlength = schema.maxLength;
    }
    if (schema.minLength) {
        f.minlength = schema.minLength;
    }
    if (schema.readOnly || schema.readonly) {
        f.readonly = true;
    }
    if (schema.minimum) {
        f.minimum = schema.minimum + (schema.exclusiveMinimum ? 1 : 0);
    }
    if (schema.maximum) {
        f.maximum = schema.maximum - (schema.exclusiveMaximum ? 1 : 0);
    }
    f.schema = schema;
    return f;
}

export default {
    name: "AnyType",
    methods: {
        isEqual,
        onClick() {
            if (this.options.mode === "editor" && !isEqual(this.selected, this.path)) {
                this.$store.commit("setSelected", this.path);
                this.options.$root.$emit("select", this.path);
            }
        },
        remove(destroyStrategy = "remove") {
            let breaked = false;
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
                            breaked = true;
                            break;
                        case "object":
                            this.model = {};
                            breaked = true;
                            break;
                        case "array":
                            this.model = [];
                            breaked = true;
                            break;
                        default:
                        // treat as remove
                    }
                    if (breaked) {
                        break;
                    }

                // eslint-disable-next-line
                case "remove":
                    this.model = undefined;
                    this.$store.commit("remove", this.path);
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
            this.remove(this.form.destroyStrategy);
        }
    },
    computed: {
        ...mapState({
            rootModel: state => state.model
        }),
        ...mapState(["selected"]),
        form() {
            const form = stdFormObj(this.name, this.sfSchema);
            if (form.schema.format) {
                form.type = form.schema.format;
            }
            if (this.sfSchema.form) {
                Object.assign(form, this.sfSchema.form);
            }
            return form;
        },
        model: {
            set(value) {
                this.$vuexSet(this.path.slice(), value);
            },
            get() {
                return get(this.$store.state, this.path);
            }
        },
        componentId() {
            const form = this.form;
            if (!this.sfSchema || !Object.keys(this.sfSchema).length) {
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
                    if (shouldUse && shouldUse(this.form, this.form.schema)) {
                        return true;
                    }
                    return name === form.type;
                });
                if (result) {
                    return `format-${result.name}`;
                }
                console.error(`unknown format `, this.sfSchema, form.type, this);
            }
            if (!form.schema.type) {
                console.error("schema needs type", form);
            }
            return `type-${form.schema.type}`;
        },
        condition() {
            let ret;
            if (this.form.condition) {
                try {
                    // eslint-disable-next-line
                    ret = new Function("model", `return ${this.form.condition};`)(this.rootModel);
                } catch (e) {
                    ret = false;
                }
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
    props: ["sf-model", "sf-schema", "options", "name", "parent", "is-last", "parent-path", "margin"],
    data() {
        return {};
    }
};
</script>


<style scoped>
/* .wrap {
    display: inline-block;
    min-width: 50%;
    vertical-align: top;
} */
.wrap.selected {
    position: relative;
    /* background-color: rgba(0,0,255,0.1); */
    outline: 1px dashed darkred;
}
</style>
