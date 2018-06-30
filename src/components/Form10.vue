<template>
    <el-form class="vue-form10" v-bind="options.formProps">
        <AnyType :parent-path="rootPath" :key="uid"
            parent="root" :sf-schema="schema"
            :options="options"></AnyType>
    </el-form>
</template>

<script>
import tv4 from "tv4";
import VueI18n from "vue-i18n";
import Vue from "vue";
import clone from "clone";
import { mapState } from "vuex";
import { Form } from "element-ui";
import validate from "../validate";
import AnyType from "./AnyType";
import store from "../store";
import { makeFormat } from "../plugin";


Vue.use(VueI18n);


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
                if (item.type === 'object' && item.properites) {
                    if (item.required) {
                        item.required.forEach((key) => {
                            item.properites[key].required = true;
                        });
                    }
                    Object.keys(item.properites).forEach((key) => {
                        addRequired(item.properites[key]);
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
            this.options.types.forEach(({ type, component }) => {
                ret[`type-${type}`] = component;
            });
            return ret;
        },
        use(plugin) {
            if (plugin.render) {
                plugin = makeFormat(plugin);
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
                            formatConfig.format
                        );
                    }
                }
                if (pluginConfig.type) {
                    this.options.types.push({
                        type: pluginConfig.type,
                        component: plugin
                    });
                }
            }
        }
    },
    props: ["sf-schema", "value", "sf-form", "sf-options", "plugins"],
    beforeMount() {
        this.options.tv4 = tv4;
        if (!this.plugins) {
            return;
        }
        this.plugins.forEach(plugin => {
            this.use(plugin);
        });
        this.$set(this.options, "compMap", this.getAnyTypeCompMap());
    },
    data() {
        return {
            rootPath: ["model"],
            uid: 0,
            componentId: "div",
            compForm: {},
            options: {
                formats: [],
                types: [],
                $rootParent: this.$parent,
                $root: this
            }
        };
    },
    components: {
        AnyType,
        "el-form": Form
    }
};
</script>


<style scoped>
</style>
