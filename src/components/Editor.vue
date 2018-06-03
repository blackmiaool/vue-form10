<template>
    <div v-if="editorSchema && path">
        <Form10 :sf-schema="editorSchema" v-model="model"
            :sf-form="form" :sf-options="options"
            :key="path.toString()" :plugins="plugins"
        />
    </div>
</template>

<script>
import { get } from "lodash";

import Form10 from "./Form10";

function getSchemaFromPath(schema, path) {
    if (!path.length) {
        return JSON.parse(JSON.stringify(schema));
    }
    if (schema.properties) {
        return getSchemaFromPath(schema.properties[path[0]], path.slice(1));
    } else if (schema.items) {
        return getSchemaFromPath(schema.items, path.slice(1));
    }
}
function getSchemaWithPathSet(schema, path, model) {
    if (!path.length) {
        return model;
    }
    if (schema.properties) {
        schema.properties[path[0]] = getSchemaWithPathSet(
            schema.properties[path[0]],
            path.slice(1),
            model
        );
    } else if (schema.items) {
        schema.items = getSchemaWithPathSet(schema.items, path.slice(1), model);
    }
    return schema;
}
const plugins = [];
const formats = [];
export default {
    name: "Editor",
    use(plugin) {
        plugins.push(plugin);
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
    },
    methods: {
        get,
        updateEditorSchema() {
            if (!this.editingSchema) {
                return null;
            }
            if (JSON.stringify(this.value) === JSON.stringify(this.preValue)) {
                return this.preSchema;
            }
            this.preValue = this.value;
            this.editorSchema = {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        title: "标题"
                    },
                    type: {
                        type: "string",
                        title: "类型",
                        "x-schema-form": {
                            titleMap: [
                                "object",
                                "array",
                                "string",
                                "boolean",
                                "number"
                            ].map(type => ({
                                value: type,
                                name: this.$t(type)
                            }))
                        }
                    },
                    format: {
                        type: "string",
                        title: "格式",
                        "x-schema-form": {
                            titleMap: this.formats
                                .map(format => format.name)
                                .map(name => ({
                                    value: name,
                                    name: this.$t(name)
                                }))
                        }
                    },
                    description: {
                        type: "string",
                        title: "描述"
                    },
                    "x-schema-form": {
                        type: "object",
                        title: "样式",
                        properties: {
                            placeholder: {
                                title: this.$t("placeholder"),
                                type: this.editingSchema.type,
                                "x-schema-form": {
                                    condition:
                                        '(model&&(model.type==="string"))'
                                }
                            },
                            startEmpty: {
                                title: "是否一开始一项都没有",
                                type: "boolean",
                                "x-schema-form": {
                                    condition: '(model&&(model.type==="array"))'
                                }
                            }
                        }
                    }
                }
            };
            this.preSchema = this.editorSchema;
        }
    },
    data() {
        return {
            model: null,
            form: ["*"],
            options: {},
            preValue: "",
            preSchema: null,
            editorSchema: null,
            formats
        };
    },
    computed: {
        editingSchema() {
            if (!this.path) {
                return null;
            }
            return getSchemaFromPath(this.value, this.path.slice(1));
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(value) {
                this.model = value;
            }
        },
        model: {
            handler(model) {
                if (!this.path) {
                    return;
                }
                const schema = getSchemaWithPathSet(
                    this.value,
                    this.path.slice(1),
                    model
                );
                this.$emit("input", schema);
                this.updateEditorSchema();
            }
        },

        path: {
            immediate: true,
            handler(path) {
                if (path) {
                    this.model = this.editingSchema;
                }
                this.updateEditorSchema();
            }
        }
    },
    props: ["value", "path", "plugins"],
    components: {
        Form10
    }
};
</script>
