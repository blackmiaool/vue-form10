<template>
    <el-form class="vue-form10" v-bind="provide.options.formProps||{}" :inline="provide.options.inline" @submit.native.prevent>
        <AnyType :parent-path="rootPath" :key="uid" parent="root" :schema="refinedSchema"></AnyType>
    </el-form>
</template>

<script>
import tv4 from "tv4";
import { mapState, mapMutations } from "vuex";
import i18n from "@/i18n";
import Vue from "vue";
import vuei18n from "vue-i18n";
import validate from "../validate";
import AnyType from "./AnyType";
import store from "../store";
import { rag2schema, getPluginFromSchemaAndPlugins } from "../util";

require("tv4/lang/zh-CN");

if (!Vue.prototype.$t) {
    Vue.use(vuei18n);
}
const defaultOptions = {
    formats: [],
    $rootParent: this.$parent,
    $root: this,
    typeDefaultFormat: {
        object: "object",
        array: "array",
        number: "number",
        integer: "number",
        string: "string",
        boolean: "boolean",
        null: "null"
    }
};
export default {
    name: "Form10",
    i18n,
    provide() {
        return this.provide;
    },
    beforeCreate() {
        this.$store = store();
    },
    computed: {
        ...mapState(["model"]),
        refinedSchema() {
            let schema = this.schema;
            if (!schema && this.rags && this.rags.length) {
                schema = this.rag2schema(this.rags[0]);
            }
            const ret = JSON.parse(JSON.stringify(schema || {}));
            function addRequired(item) {
                if (!item) {
                    return;
                }
                if (item.type === "object" && item.properties) {
                    if (item.required && Array.isArray(item.required)) {
                        item.required.forEach(key => {
                            if (item.properties[key].type !== "object") {
                                item.properties[key].required = true;
                            }
                        });
                    }
                    Object.keys(item.properties).forEach(key => {
                        addRequired(item.properties[key]);
                    });
                } else if (item.type === "array") {
                    addRequired(item.items);
                }
            }
            addRequired(ret);
            if (this.computeSchema) {
                return this.computeSchema(ret);
            }
            return ret;
        }
    },
    watch: {
        "options.inheritState": {
            handler(state) {
                this.mergeState(state);
            },
            deep: true,
            immediate: true
        },
        plugins: {
            immediate: true,
            deep: true,
            handler(plugins = []) {
                plugins.forEach(plugin => {
                    this.use(plugin);
                });
                this.$set(this.provide, "compMap", this.getAnyTypeCompMap());
                this.$set(this.provide, "plugins", plugins);
            }
        },
        options: {
            immediate: true,
            deep: true,
            handler(value) {
                if (!value) {
                    return;
                }
                Object.keys(value).forEach(key => {
                    this.$set(this.provide.options, key, value[key]);
                });
                this.provide.options = Object.assign({}, value, defaultOptions);
            }
        },
        model: {
            deep: true,
            handler(model) {
                this.$emit("input", model);
            }
        },
        rags: {
            deep: true,
            handler() {
                this.uid++;
            }
        },
        schema: {
            deep: true,
            handler() {
                this.uid++;
            }
        },
        value: {
            immediate: true,
            handler(value) {
                this.$store.commit("setModel", { value });
            }
        }
    },
    methods: {
        ...mapMutations(["mergeState"]),
        rag2schema(rag) {
            return rag2schema(rag, ragThis => {
                return getPluginFromSchemaAndPlugins(ragThis, this.plugins, this.options.typeDefaultFormat);
            });
        },
        async submit() {
            let value = JSON.parse(JSON.stringify(this.value));
            function stripEmptyStr(obj) {
                Object.keys(obj).forEach(key => {
                    if (typeof obj[key] === "string") {
                        obj[key] = obj[key].trim();
                        if (!obj[key]) {
                            delete obj[key];
                        }
                    } else if (obj[key] && typeof obj[key] === "object") {
                        stripEmptyStr(obj[key]);
                    }
                });
            }
            if (value && typeof value === "object") {
                stripEmptyStr(value);
            } else if (typeof value === "string") {
                value = value.trim();
                if (!value) {
                    value = null;
                }
            }

            const validateResult = await validate(value, this.refinedSchema);
            if (validateResult && validateResult.length) {
                return { error: validateResult[0], errors: validateResult };
            }
            return { value };
        },
        getAnyTypeCompMap() {
            const ret = {};
            this.provide.formats.forEach(({ name, component }) => {
                ret[`format-${name}`] = component;
            });
            return ret;
        },
        use(plugin) {
            function getFormatConfig() {
                return Object.assign(
                    {
                        component: plugin
                    },
                    plugin.form10.format
                );
            }
            if (plugin.render) {
                const pluginConfig = plugin.form10 || {};
                if (pluginConfig.format) {
                    const formatConfig = getFormatConfig();
                    const index = this.provide.formats.findIndex((format) => {
                        return format.name === formatConfig.name;
                    });
                    if (index > -1) {
                        this.provide.formats.splice(index, 1, formatConfig);
                    } else {
                        this.provide.formats.push(formatConfig);
                    }
                    if (formatConfig.format instanceof RegExp) {
                        tv4.addFormat(formatConfig.name, data => {
                            if (!formatConfig.format.test(data)) {
                                return this.$t("Invalid format");
                            }
                            return null;
                        });
                    } else {
                        tv4.addFormat(formatConfig.name, formatConfig.format || "");
                    }
                }
            }
        }
    },
    props: {
        rags: {
            type: Array
        },
        schema: {
            type: Object
        },
        value: {},
        computeSchema: {
            type: Function
        },
        options: {
            type: Object,
            default() {
                return {};
            }
        },
        plugins: {
            type: Array
        }
    },
    data() {
        return {
            provide: {
                compMap: {},
                plugins: [],
                formats: [],
                options: {}
            },
            rootPath: ["model"],
            uid: 0,
            componentId: "div",
            compForm: {}
        };
    },
    components: {
        AnyType
    }
};
</script>


<style lang="less">
.vue-form10 {
    .el-form-item__content {
        line-height: 25px;
    }
    .el-form-item__label {
        line-height: 35px;
    }
    .el-form-item {
        margin-bottom: 10px;
    }
}
</style>
