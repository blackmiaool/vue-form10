<template>
    <div v-if="editorSchema && path">
        <Form10 :sf-schema="editorSchema" v-model="model"
            :sf-form="form" :sf-options="options"
        />
    </div>
</template>

<script>
import { get } from "lodash";
import Form10 from "./Form10";

export default {
    name: "Editor",
    methods: {
        get
    },
    data() {
        return {
            model: null,
            editorSchema: {
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
                                { value: "object", name: "对象" },
                                { value: "array", name: "数组" },
                                {
                                    value: "string",
                                    name: "字符串"
                                },
                                {
                                    value: "boolean",
                                    name: "布尔值"
                                },
                                {
                                    value: "number",
                                    name: "数字"
                                }
                            ]
                        }
                    },
                    description: {
                        type: "string",
                        title: "描述",
                    },
                }
            },
            form: ["*"],
            options: {}
        };
    },
    watch: {
        path: {
            immediate: true,
            handler(path) {
                console.log("path", path);
                if (path) {
                    console.log(this.schema, get(this.schema, path.slice(1)));
                    this.model = get(this.schema.properties, path.slice(1));
                }
            }
        }
    },
    props: ["schema", "path"],
    components: {
        Form10
    }
};
</script>
