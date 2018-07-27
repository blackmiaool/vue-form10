<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <el-select v-model="model" :placeholder="form.placeholder"
            slot="input" :disabled="schema.readOnly">
            <el-option v-for="(item,index) in titleMap"
                :key="index" :label="$t(item.name)"
                :value="item.value">
            </el-option>
        </el-select>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";

export default {
    name: "select-format",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: "select",
            format: "",
            shouldUse(form, schema) {
                return form.titleMap || schema.enum;
            },
            types: ["number", "string"]
        },
        preview: {
            schema: {
                type: "string",
                form: {
                    titleMap: [{ value: "1", name: "a" }, { value: "2", name: "b" }, { value: "3", name: "c" }]
                }
            }
        },
        schema: {
            type: "object",
            // form: {
            //     strip: true,
            // },
            properties: {
                titleMap: {
                    type: "array",
                    items: {
                        type: "object",
                        form: {
                            layout: 'half'
                        },
                        properties: {
                            name: {
                                type: "string",
                                title: "name"
                            },
                            value: {
                                type: "string",
                                title: "value"
                            },
                        }
                    }
                }
            }
        }
    },
    computed: {
        titleMap() {
            let arr = [];
            if (this.form.titleMap) {
                const titleMap = this.form.titleMap;
                if (Array.isArray(titleMap)) {
                    arr = titleMap;
                } else if (typeof titleMap === "object") {
                    arr = Object.keys(titleMap).map(key => {
                        return { value: key, name: titleMap[key] };
                    });
                } else {
                    console.warn("invalid titleMap:", this.form.titleMap);
                }
            } else if (this.schema.enum) {
                arr = this.schema.enum.map(name => {
                    return { value: name, name };
                });
            }
            return arr;
        }
    }
};
</script>

