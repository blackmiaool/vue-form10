<template>
    <el-form class="vue-form10" v-bind="options.formProps">
        <AnyType :parent-path="rootPath" :key="uid"
            parent="root" :sf-schema="schema"
            :options="options"></AnyType>
    </el-form>
</template>

<script>
import tv4 from "tv4";
import clone from "clone";
import { mapState } from "vuex";
import validate from "../validate";
import AnyType from "./AnyType";
import store from "../store";
import FormatMixin0 from "../mixins/format";

export { default as tv4 } from 'tv4';
export { default as i18n } from '../i18n';
export * from "../util";


export const FormatMixin = FormatMixin0;


export default {
    name: "Form10",
    // store: store(),
    beforeCreate() {
        this.$store = store();
    },
    provide() {
        return { options: this.sfOptions };
    },
    computed: {
        ...mapState(["model"]),
        schema() {
            const ret = clone(this.sfSchema || {});
            function addRequired(item) {
                if (!item) {
                    return;
                }
                if (item.type === 'object' && item.properties) {
                    if (item.required) {
                        item.required.forEach((key) => {
                            item.properties[key].required = true;
                        });
                    }
                    Object.keys(item.properties).forEach((key) => {
                        addRequired(item.properties[key]);
                    });
                } else if (item.type === 'array') {
                    addRequired(item.items);
                }
            }
            addRequired(ret);
            return ret;
        }
    },
    watch: {
        plugins: {
            immediate: true,
            deep: true,
            handler(plugins) {
                this.options.tv4 = tv4;
                plugins.forEach(plugin => {
                    this.use(plugin);
                });
                this.$set(this.options, "compMap", this.getAnyTypeCompMap());
            }
        },
        sfOptions: {
            immediate: true,
            deep: true,
            handler(value) {
                Object.keys(value).forEach(key => {
                    this.$set(this.options, key, value[key]);
                });
            }
        },
        model: {
            deep: true,
            handler(model) {
                this.$emit("input", model);
            }
        },
        sfSchema: {
            deep: true,
            handler() {
                this.uid++;
            }
        },
        form: {
            deep: true,
            handler() {
                this.uid++;
            }
        },
        value: {
            immediate: true,
            handler(value) {
                // console.log('sf', model);
                this.$store.commit("setModel", { value });
            }
        }
    },
    methods: {
        __validate() {},
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

            const validateResult = validate(value, this.schema);
            if (validateResult) {
                return { error: validateResult };
            }
            return { value };
        },
        getAnyTypeCompMap() {
            const ret = {};
            this.options.formats.forEach(({ name, component }) => {
                ret[`format-${name}`] = component;
            });
            return ret;
        },
        use(plugin) {
            if (plugin.render) {
                const pluginConfig = plugin.form10 || {};
                if (pluginConfig.format) {
                    const formatConfig = pluginConfig.format;
                    this.options.formats.push(
                        Object.assign(
                            {
                                component: plugin
                            },
                            formatConfig
                        )
                    );
                    if (formatConfig.format instanceof RegExp) {
                        this.options.tv4.addFormat(formatConfig.name, data => {
                            if (!formatConfig.format.test(data)) {
                                return "invalid format";
                            }
                            return null;
                        });
                    } else {
                        this.options.tv4.addFormat(
                            formatConfig.name,
                            formatConfig.format || "",
                        );
                    }
                }
            }
        }
    },
    props: {
        'sf-schema': {
            type: Object,
        },
        value: {},
        'sf-options': {
            type: Object,
        },
        plugins: {
            type: Array
        },
    },
    beforeMount() {
        this.options.tv4 = tv4;
    },
    data() {
        return {
            rootPath: ["model"],
            uid: 0,
            componentId: "div",
            compForm: {},
            options: {
                formats: [],
                $rootParent: this.$parent,
                $root: this,
                typeDefaultFormat: {
                    object: 'object',
                    array: 'array',
                    number: 'number',
                    integer: 'number',
                    string: 'string',
                    boolean: 'boolean',
                    null: 'null'
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
