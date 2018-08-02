<template>
    <div class="any-type-wrap" :class="{selected:isEqual(selected,path),expand:schema.type==='object'||schema.type==='array'||(targetPlugin&&targetPlugin.form10.format.expand)}">
        <component v-if="condition" :is="componentId" :schema="schema" :parent="parent" :path="path" :options="options" :name="name" :margin="margin"></component>
    </div>
</template>

<script>
import { mapState } from "vuex";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { stdFormObj, getPluginFromSchemaAndPlugins } from "../util";

export default {
    name: "AnyType",
    methods: {
        isEqual,
        remove(destroyStrategy = "remove") {
            let breaked = false;
            switch (destroyStrategy) {
                case "retain":
                    break;
                case "null":
                    this.model = null;
                    break;
                case "empty":
                    switch (this.schema.type) {
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
        targetPlugin() {
            return getPluginFromSchemaAndPlugins(this.schema, this.options.plugins, this.options.typeDefaultFormat);
        },
        form() {
            const form = stdFormObj(this.name, this.schema);
            if (this.schema.form) {
                Object.assign(form, this.schema.form);
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

            if (!schema || !Object.keys(schema).length) {
                return null;
            }
            const targetPlugin = this.targetPlugin;
            if (targetPlugin) {
                return `format-${targetPlugin.form10.format.name}`;
            }
            console.error(`Can't decide format of `, schema, form, format, type, this);

            return null;
        },
        condition() {
            let ret;
            if (this.schema.condition) {
                try {
                    // eslint-disable-next-line
                    ret = new Function("model", `return ${this.schema.condition};`)(this.rootModel);
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
    props: ["schema", "options", "name", "parent", "is-last", "parent-path", "margin"],
    data() {
        return {};
    }
};
</script>

<style lang="less">
// .any-type-wrap>
</style>

<style lang="less">
.any-type-wrap {
    &.expand {
        > .el-form-item {
            display: block;
            > .el-form-item__content {
                display: block;
            }
        }
    }
}
</style>
