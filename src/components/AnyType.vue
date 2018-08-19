<template>
    <div class="any-type-wrap" :class="{selected:isEqual(selected,path),expand:schema.type==='object'||schema.type==='array'||(targetPlugin&&targetPlugin.form10.format.expand),inline:options.inline}">
        <component v-if="condition" :is="componentId" :schema="schema" :parent="parent" :path="path" :name="name" :margin="margin"></component>
    </div>
</template>

<script>
import { mapState } from "vuex";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { stdFormObj, getPluginFromSchemaAndPlugins } from "../util";

function getConditionFunc(condition) {
    // eslint-disable-next-line no-new-func
    return new Function("model", "root", "rootModel", "parent", "parentModel", `return ${condition};`);
}
/**
 * @param params object {root,parent}
 */
export function getCondition(schema, params) {
    if (!schema.condition) {
        return true;
    }
    let ret;
    let func;
    const paramsArr = [params.root, params.root, params.root, params.parent, params.parent];
    if (this.conditionFunc) {
        func = this.conditionFunc.bind(this);
    } else {
        func = getConditionFunc(schema.condition);
    }
    try {
        console.log(func, paramsArr);
        ret = Boolean(func(...paramsArr));
    } catch (e) {
        ret = true;
    }
    return ret;
}
export default {
    name: "AnyType",
    inject: ["compMap", "plugins", "formats", "options"],
    provide() {
        let options = this.options;
        if (this.schema.options) {
            options = Object.assign({}, options, this.schema.options);
        } else {
            return;
        }
        const ret = { options };
        return ret;
    },
    methods: {
        isEqual,
        getCondition,
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
        parentModel: {
            set(value) {
                this.$vuexSet(this.path.slice(0, this.path.length - 1), value);
            },
            get() {
                return get(this.$store.state, this.path.slice(0, this.path.length - 1));
            }
        },
        targetPlugin() {
            return getPluginFromSchemaAndPlugins(this.schema, this.plugins, this.options.typeDefaultFormat);
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
        conditionFunc() {
            return getConditionFunc(this.schema.condition);
        },
        condition() {
            return this.getCondition(this.schema, {
                root: this.rootModel,
                parent: this.parentModel,
            });
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
        Object.assign(this.$options.components, this.compMap);
    },
    props: ["schema", "name", "parent", "is-last", "parent-path", "margin"],
    data() {
        return {};
    }
};
</script>

<style lang="less">
// .any-type-wrap>
</style>

<style lang="less">
.any-type-wrap:not(.inline) {
    > .el-form-item {
        >.el-form-item__content{
            clear: both;
        }
    }
}
.any-type-wrap.inline {
    > .el-form-item {
        display: flex;
        >.el-form-item__content{
            flex:1;
        }
    }
    // &.expand {
    //     > .el-form-item {
    //         display: block;
    //         > .el-form-item__content {
    //             display: block;
    //         }
    //     }
    // }
}
</style>
