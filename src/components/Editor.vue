<template>
    <div v-if="editorSchema && path">
        <Form10 :sf-schema="editorSchema" v-model="model"
            :sf-form="form" :sf-options="options"
            :key="path.toString()" :plugins="plugins"
        />
    </div>
</template>

<script>
import get from "lodash/get";

import Form10 from "./Form10";

function getCircularKeys(obj, opt = { left: 300 }, prekeys) {
    if (!obj || typeof obj !== "object") {
        return true;
    }
    let keys = Object.keys(obj);
    function appendKeys(propertiesKeys) {
        opt.left -= propertiesKeys.length;
        if (opt.left <= 0 || isNaN(opt.left)) {
            return true;
        }
        return false;
    }
    if (appendKeys(keys)) {
        return keys;
    }
    // eslint-disable-next-line
    for (const key in obj) {
        try {
            const propertiesKeys = getCircularKeys(obj[key], opt, keys);
            keys = [...keys, ...propertiesKeys];
            if (appendKeys(propertiesKeys)) {
                return keys;
            }
        } catch (e) {
            console.log(e, JSON.stringify(keys), obj, opt.left, prekeys);
            return [];
        }
    }
    return keys;
}
function getSchemaFromPath(schema, path) {
    const keys = getCircularKeys(schema);
    if (keys.length > 190) {
        console.log(keys);
    }
    try {
        if (!path.length) {
            return JSON.parse(JSON.stringify(schema));
        }
    } catch (e) {
        console.log(e, schema, Object.keys(schema), path);
        return {};
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
export default {
    name: "Editor",
    methods: {
        get,
        updateEditorSchema() {
            if (!this.editingSchema) {
                return null;
            }

            const format =
                this.editingSchema.type ||
                this.editingSchema["x-schema-form"].type;

            let targetPlugin;
            if (format) {
                targetPlugin = this.plugins.find(plugin => {
                    const shouldUse = get(plugin, "form10.format.shouldUse");
                    if (
                        shouldUse &&
                        shouldUse(
                            this.editingSchema["x-schema-form"] || {},
                            this.editingSchema
                        )
                    ) {
                        return true;
                    }
                    return get(plugin, "form10.format.name") === format;
                });
            }
            if (!targetPlugin) {
                targetPlugin = this.plugins.find(plugin => {
                    return (
                        get(plugin, "form10.type") === this.editingSchema.type
                    );
                });
            }

            if (
                JSON.stringify(this.value) === JSON.stringify(this.preValue) &&
                this.targetPlugin === targetPlugin
            ) {
                return this.preSchema;
            }
            this.targetPlugin = targetPlugin;
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
                                .map(formatThis => formatThis.name)
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
            targetPlugin: null
        };
    },
    computed: {
        editingSchema() {
            if (!this.path) {
                return null;
            }
            return getSchemaFromPath(this.value, this.path.slice(1));
        },
        formats() {
            return this.plugins
                .filter(plugin => {
                    return plugin.form10.format;
                })
                .map(format => {
                    return format.form10.format;
                });
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
