<template>
    <div>
        <draggable class="draggable" v-model="rags" :options="draggableOptions" :class="{empty:!rags.length}" @change="onChange">
            <Rag v-for="schema in rags" :key="schema.form10uid" class="item" :schema='schema' :plugins="plugins" :root="true">
            </Rag>
        </draggable>
        <el-dialog :title="$t('edit')" :visible.sync="editDialogVisible" width="70%">
            <el-row :gutter="20">
                <el-col :span="12">
                    <Form10 :schema="schemaSchema" v-model="editResult" :options="options" :plugins="plugins" />
                </el-col>
                <el-col :span="12">
                    <Form10 :schema="formSchema" v-model="editResult.form" :options="options" :plugins="plugins" />
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
import { strip, getPluginFromSchemaAndPlugins, getFormSchema, getDefaultFromSchema } from "@/util";
import Vue from "vue";
import i18n from "@/i18n";
import Rag from "./Rag";
import Form10 from "./Form10";

const vue = new Vue();
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
        draggableOptions,
        eventHub: vue
    },
    name: "NestedList",
    i18n,
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


            const targetPlugin = this.targetPlugin;

            const pluginSchema = getFormSchema(targetPlugin, this.editingSchema);
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
        }
    },
    beforeMount() {
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

            this.targetPlugin = getPluginFromSchemaAndPlugins(this.editingSchema, this.plugins);
        });
        vue.$on('change', event => {
            this.onChange(event);
        });
    },
    mounted() {
        this.commonSchema = {
            title: {
                type: "string",
                title: "标题"
            },

            required: {
                type: "boolean",
                title: "必填",
                autoRemove: true
            },
            readOnly: {
                type: "boolean",
                title: "readonly",
                autoRemove: true
            },
            autoRemove: {
                type: "boolean",
                title: "Auto Remove",
                autoRemove: true,
                description: "提交时如果是空值则自动删除省位置",
            },
            defaultJSON: {
                type: 'string',
                title: '默认值',
                description: `格式为JSON\n字符串的默认值形如"abc"（带引号）`,
                autoRemove: true
            },
            description: {
                type: "string",
                title: "描述",
                format: "textarea",
                autoRemove: true
            },
            condition: {
                type: "string",
                title: "出现条件",
                autoRemove: true,
                description: "注入变量：\nmodel：最上层的值\nparentModel：上一层的值"
            },
            type: {
                type: "string",
                title: "类型",
                format: "select",
                readOnly: true,
                form: {
                    titleMap: ["object", "array", "string", "boolean", "number", "null", "integer"].map(type => ({
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
                    title: "开始为空",
                    type: "boolean",
                    description: "是否一开始一项都没有",
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
            targetPlugin: null,
            editDialogVisible: false,
            editingSchema: null,
            editingUid: null,
            commonSchema: null,
            typeSchema: null,
            options: {
                inline: true,
                formProps: {
                    "label-width": "80px"
                }
            },
            editResult: {}
        };
    },
    methods: {
        eachRag(rags, cb) {
            rags.forEach((rag) => {
                cb(rag);
                if (rag.rags) {
                    this.eachRag(rag.rags, cb);
                }
            });
        },
        getUid() {
            let max = 0;
            this.eachRag(this.rags, (rag) => {
                if (!rag.form10uid) {
                    return;
                }
                const uid = rag.form10uid.match(/\d+$/) * 1;
                if (max < uid) {
                    max = uid;
                }
            });
            return max + 1;
        },
        onChange(event) {
            if (event.added) {
                const uid = `uid${this.getUid()}`;
                const targetPlugin = getPluginFromSchemaAndPlugins(event.added.element, this.plugins);
                const formSchema = getFormSchema(targetPlugin, event.added.element);
                if (formSchema) {
                    event.added.element.form = getDefaultFromSchema(formSchema);
                }


                this.$set(event.added.element, 'form10uid', uid);
                this.$set(event.added.element, 'form10key', uid);
            }
        },
        editSubmit() {
            this.editResult = strip(this.editResult, this.combinedSchema);

            ['properties', 'items'].forEach((key) => {
                let child = this.targetPlugin.form10.format[key];
                if (child) {
                    if (typeof child === 'function') {
                        child = child(this.editResult);
                    }

                    this.$set(this.editResult, key, child);
                }
            });

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
