<template>
    <el-form class="vue-form10">
        <AnyType :parent-path="rootPath" :key="uid"
            parent="root" :sf-schema="sfSchema||{}" :options="this.options"></AnyType>
    </el-form>
</template>

<script>
import Ajv from "ajv";
import { mapState } from "vuex";
import { Form } from "element-ui";
import AnyType from "./AnyType";
import store from "../store";
import { makeFormat } from "../plugin";

const formats = [];
const types = [];

export default {
    name: "Form10",
    store,
    use(plugin) {
        if (plugin.render) {
            plugin = makeFormat(plugin);
            const pluginConfig = plugin.form10 || {};
            if (pluginConfig.format) {
                formats.push(
                    Object.assign(
                        {
                            component: plugin
                        },
                        pluginConfig.format
                    )
                );
            }
            if (pluginConfig.type) {
                types.push({
                    type: pluginConfig.type,
                    component: plugin
                });
            }
        }
    },
    beforeMount() {
        const ajv = new Ajv();
        formats.forEach(({ name, format }) => {
            ajv.addFormat(name, format);
        });
        this.options.ajv = ajv;
    },
    provide() {
        return { options: this.sfOptions };
    },
    computed: {
        ...mapState(["model"])
    },
    watch: {
        sfOptions: {
            deep: true,
            handler(value) {
                Object.assign(this.options, value);
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
                console.log('handler');
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
            formats.forEach(({ name, component }) => {
                ret[`format-${name}`] = component;
            });
            types.forEach(({ type, component }) => {
                ret[`type-${type}`] = component;
            });
            return ret;
        }
    },
    props: ["sf-schema", "value", "sf-form", "sf-options"],
    data() {
        return {
            rootPath: ["model"],
            uid: 0,
            componentId: "div",
            compForm: {},
            options: {
                compMap: this.getAnyTypeCompMap(),
                formats,
                types,
                $rootParent: this.$parent
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
