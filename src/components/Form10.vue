<template>
    <el-form class="vue-form10">
        <AnyType :parent-path="rootPath" :key="uid"
            parent="root" :sf-schema="sfSchema||{}"
            :options="this.options"></AnyType>
    </el-form>
</template>

<script>
import Ajv from "ajv";

import { mapState } from "vuex";
import { Form } from "element-ui";
import AnyType from "./AnyType";
import store from "../store";
import { makeFormat } from "../plugin";

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
        ...mapState(["model"])
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
                    this.options.formats.push(
                        Object.assign(
                            {
                                component: plugin
                            },
                            pluginConfig.format
                        )
                    );
                    this.options.ajv.addFormat(pluginConfig.format.name, pluginConfig.format.format);
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
        const ajv = new Ajv({ allErrors: true });
        this.options.ajv = ajv;
        if (!this.plugins) {
            return;
        }
        this.plugins.forEach(plugin => { this.use(plugin); });
        this.$set(this.options, 'compMap', this.getAnyTypeCompMap());
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
