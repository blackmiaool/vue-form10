<template>
    <div class="wrap" :class="{selected:isEqual(selected,path)}"
        @click.stop="onClick">
        <component v-if="condition" :is="componentId"
            :sf-schema="sfSchema"
            :parent="parent" :path="path" :options="options"
            :name="name" :margin="margin"></component>
    </div>
</template>

<script>
import { mapState } from "vuex";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { stdFormObj } from "../util";

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
        schema() {
            return this.sfSchema;
        },
        form() {
            const form = stdFormObj(this.name, this.sfSchema);
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
            const schema = this.schema;

            const format = schema.format;
            const type = schema.type;

            const options = this.options;
            if (!schema || !Object.keys(schema).length) {
                return null;
            }
            let result;
            if (format) {
                result = options.formats.find(({ name, shouldUse }) => {
                    if (shouldUse && shouldUse(form, schema)) {
                        return true;
                    }
                    return name === format;
                });
                if (result) {
                    return `format-${result.name}`;
                }
                console.error(`unknown format `, schema, form, format, type, this);
            } else { // use default format
                return `format-${options.typeDefaultFormat[type]}`;
            }
            if (!type) {
                console.error("schema needs type", schema);
            }
            return '';
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
