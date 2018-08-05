<template>
    <el-form class="vue-form10" v-bind="options.formProps||{}" :inline="options.inline">
        <AnyType :parent-path="rootPath" :key="uid"
            parent="root" :schema="refinedSchema"
            :options="refinedOptions"></AnyType>
    </el-form>
</template>

<script>
import tv4 from "tv4";
import { mapState, mapMutations } from "vuex";
import validate from "../validate";
import AnyType from "./AnyType";
import store from "../store";

require("tv4/lang/zh-CN");


export default {
    name: "Form10",
    // store: store(),
    beforeCreate() {
        this.$store = store();
    },
    provide() {
        return { options: this.options };
    },
    computed: {
        ...mapState(["model"]),
        refinedSchema() {
            const ret = JSON.parse(JSON.stringify(this.schema || {}));
            function addRequired(item) {
                if (!item) {
                    return;
                }
                if (item.type === "object" && item.properties) {
                    if (item.required && Array.isArray(item.required)) {
                        item.required.forEach(key => {
                            item.properties[key].required = true;
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
            handler(plugins) {
                plugins.forEach(plugin => {
                    this.use(plugin);
                });
                this.$set(this.refinedOptions, "compMap", this.getAnyTypeCompMap());
                this.$set(this.refinedOptions, "plugins", plugins);
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
                    this.$set(this.refinedOptions, key, value[key]);
                });
            }
        },
        model: {
            deep: true,
            handler(model) {
                this.$emit("input", model);
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
        submit() {
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

            const validateResult = validate(value, this.refinedSchema);
            if (validateResult && validateResult.length) {
                return { error: validateResult[0], errors: validateResult };
            }
            return { value };
        },
        getAnyTypeCompMap() {
            const ret = {};
            this.refinedOptions.formats.forEach(({ name, component }) => {
                ret[`format-${name}`] = component;
            });
            return ret;
        },
        use(plugin) {
            if (plugin.render) {
                const pluginConfig = plugin.form10 || {};
                if (pluginConfig.format) {
                    const formatConfig = pluginConfig.format;
                    this.refinedOptions.formats.push(
                        Object.assign(
                            {
                                component: plugin
                            },
                            formatConfig
                        )
                    );
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
        schema: {
            type: Object
        },
        value: {},
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
            rootPath: ["model"],
            uid: 0,
            componentId: "div",
            compForm: {},
            refinedOptions: {
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
            }
        };
    },
    components: {
        AnyType
    }
};
</script>


<style scoped>
</style>
