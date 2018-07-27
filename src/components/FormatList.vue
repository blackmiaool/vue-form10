<template>
    <Form10 ref="form10" :sf-schema="schema"
        v-model="model" :sf-options="options"
        :plugins="plugins" />
</template>

<script>
import draggable from "vuedraggable";
import Vue from "vue";
import Form10 from "./Form10";
import { assignDeep } from "../util";

Vue.component("draggable", draggable);
export default {
    name: "FormatList",
    computed: {
        schema() {
            const properties = {};
            const model = [];

            this.plugins.forEach(plugin => {
                const format = plugin.form10.format;
                if (!format.types) {
                    console.warn("plugin must have form10.format.types", plugin);
                    return;
                }
                if (format.name === "drag-list") {
                    return;
                }

                let schema = {
                    title: this.$t(format.name),
                    format: format.name,
                    type: format.types[0],
                    rags: [],
                    form: {
                        notitle: true
                    }
                };

                if (plugin.form10.preview) {
                    if (plugin.form10.preview.sealed) {
                        schema.sealed = true;
                    }
                    if (plugin.form10.preview.schema) {
                        schema = assignDeep(schema, plugin.form10.preview.schema);
                    }
                }
                properties[format.name] = schema;
                model.push(schema);
            });
            const ret = {
                type: "object",
                format: "drag-list",
                properties,
                form: {
                    model
                }
            };
            return ret;
        },
        formats() {
            return this.plugins.filter(plugin => {
                return plugin.form10 && plugin.form10.format;
            });
        }
    },
    methods: {},
    mounted() {},
    props: ["plugins"],
    data() {
        return {
            model: null,
            options: {
                mode: "preview"
            }
        };
    },
    components: {
        Form10
    }
};
</script>
<style lang="less">
</style>

