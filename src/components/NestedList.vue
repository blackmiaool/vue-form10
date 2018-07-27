<template>
    <div>
        <draggable class="draggable" v-model="rags"
            :options="draggableOptions" :class="{empty:!rags.length}">
            <Rag v-for="schema in rags" :key="schema.form10uid"
                class="item" :schema='schema'
                :root="true">
            </Rag>
        </draggable>
        <el-dialog :title="$t('edit')" :visible.sync="editDialogVisible"
            width="70%">
            <el-row :gutter="20">
                <el-col :span="12">
                    <Form10 :sf-schema="schemaSchema" v-model="editResult"
                        :sf-options="options"
                        :plugins="plugins" />
                </el-col>
                <el-col :span="12">
                    <Form10 :sf-schema="formSchema" v-model="editResult.form"
                        :sf-options="options"
                        :plugins="plugins" />
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">{{$t('Cancel')}}</el-button>
                <el-button type="primary" @click="editSubmit">{{$t('OK')}}</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { strip } from "@/util";
import Vue from "vue";
import get from "lodash/get";
import Rag from "./Rag";
import Form10 from "./Form10";


function getPositionFromUid(rags, uid) {
    let ret;
    rags.some((rag, index, list) => {
        if (rag.form10uid === uid) {
            ret = {
                list,
                index,
                rag
            };
            return true;
        }
        if (rag.rags.length) {
            const result = getPositionFromUid(rag.rags, uid);
            if (result) {
                ret = result;
                return true;
            }
        }
        return false;
    });
    return ret;
}
const draggableOptions = {
    group: "a",
    animation: 150
};
export default {
    provide: {
        draggableOptions
    },
    name: "NestedList",
    props: {
        value: {
            type: Array,
            default: () => []
        },
        plugins: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        rags: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            }
        },
        disabled() {
            return this.rags.length === 1;
        },
        draggableOptions() {
            return Object.assign({}, draggableOptions, {
                disabled: this.disabled
            });
        },
        formSchema() {
            if (!this.editingSchema) {
                return null;
            }
            let targetPlugin;
            const format = this.editingSchema.format || this.editingSchema.type;
            if (format) {
                targetPlugin = this.plugins.find(plugin => {
                    const shouldUse = get(plugin, "form10.format.shouldUse");
                    if (shouldUse && shouldUse(this.editingSchema.form || {}, this.editingSchema)) {
                        return true;
                    }
                    return false;
                });
                if (!targetPlugin) {
                    targetPlugin = this.plugins.find(plugin => {
                        return get(plugin, "form10.format.name") === format;
                    });
                }
            }
            const pluginSchema = targetPlugin.form10.schema;
            if (pluginSchema) {
                pluginSchema.title = "特有属性";
                return pluginSchema;
            }
            return null;
        },
        schemaSchema() {
            if (!this.editingSchema) {
                return null;
            }

            // todo: use form10 to decide plugin

            const ret = {
                type: "object",
                properties: Object.assign({}, this.commonSchema, this.typeSchema[this.editingSchema.type])
            };

            return ret;
        },
        combinedSchema() {
            return { ...this.schemaSchema, form: this.formSchema };
        },
    },
    beforeMount() {
        const vue = new Vue();
        this.$options.provide.eventHub = vue;
        vue.$on("remove", uid => {
            const { list, index } = getPositionFromUid(this.value, uid);
            list.splice(index, 1);
        });
        vue.$on("edit", uid => {
            const { rag } = getPositionFromUid(this.value, uid);
            this.editDialogVisible = true;
            this.editingUid = uid;
            this.editingSchema = rag;
            this.editResult = JSON.parse(JSON.stringify(rag));
        });
    },
    mounted() {
        this.commonSchema = {
            title: {
                type: "string",
                title: "标题"
            },
            type: {
                type: "string",
                title: "类型",
                format: "select",
                readOnly: true,
                form: {
                    titleMap: ["object", "array", "string", "boolean", "number"].map(type => ({
                        value: type,
                        name: this.$t(type)
                    }))
                }
            },
            format: {
                type: "string",
                title: "格式",
                readOnly: true
            },
            readOnly: {
                type: "boolean",
                title: "readonly",
                autoRemove: true
            },
            description: {
                type: "string",
                title: "描述",
                format: "textarea",
                autoRemove: true
            }
        };
        this.typeSchema = {
            string: {
                maxLength: {
                    type: "number",
                    title: "最大长度"
                },
                minLength: {
                    type: "number",
                    title: "最小长度"
                },
                pattern: {
                    type: "string",
                    title: "模式",
                    description: "用正则表达式来验证"
                }
            },
            number: {
                multipleOf: {
                    type: "number",
                    title: "是其倍数"
                },
                maximum: {
                    type: "number",
                    title: "最大值"
                },
                minimum: {
                    type: "number",
                    title: "最小值"
                }
            },
            array: {
                startEmpty: {
                    title: "是否一开始一项都没有",
                    type: "boolean",
                    autoRemove: true
                },
                maxItems: {
                    type: "number",
                    title: "最大长度"
                },
                minItems: {
                    type: "number",
                    title: "最小长度"
                }
            },
            object: {},
            boolean: {}
        };
    },
    data() {
        return {
            editDialogVisible: false,
            editingSchema: null,
            editingUid: null,
            commonSchema: null,
            typeSchema: null,
            options: {},
            editResult: {}
        };
    },
    methods: {
        editSubmit() {
            this.editResult = strip(this.editResult, this.combinedSchema);
            const { list, index } = getPositionFromUid(this.value, this.editingUid);
            list.splice(index, 1, JSON.parse(JSON.stringify(this.editResult)));
            this.editDialogVisible = false;
        }
    },
    components: { Rag, Form10 }
};
</script>

<style scoped lang="less">
.draggable {
    min-height: 100px;
    &.empty {
        background-color: #f3f3f3;
    }

    padding: 10px;
}
</style>
