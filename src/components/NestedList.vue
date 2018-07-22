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
            width="30%">
            <Form10 :sf-schema="editorSchema" v-model="editResult"
                :sf-options="options" :plugins="plugins"
            />
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">{{$t('Cancel')}}</el-button>
                <el-button type="primary" @click="editSubmit">{{$t('OK')}}</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import Vue from "vue";
import get from "lodash/get";
import Rag from "./Rag";
import Form10 from "./Form10";

export function rag2schema(rag) {
    rag = JSON.parse(JSON.stringify(rag));
    if (rag.type === "array") {
        let items;
        if (rag.rags.length > 1) {
            items = rag2schema({
                type: "object",
                rags: rag.rags
            });
        } else if (rag.rags.length === 1) {
            items = rag2schema(rag.rags[0]);
        }
        rag.items = items;
    } else if (rag.type === "object") {
        rag.properties = {};
        rag.rags.forEach(child => {
            const key = child.form10key || child.form10uid;
            rag.properties[key] = rag2schema(child);
        });
    }
    if (rag.type === rag.format) {
        delete rag.format;
    }
    if (rag.form && Object.keys(rag.form).length === 0) {
        delete rag.form;
    }
    delete rag.rags;
    delete rag.form10uid;
    delete rag.form10key;
    return rag;
}
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
        editorSchema() {
            if (!this.editingSchema) {
                return null;
            }

            // todo: use form10 to decide plugin
            const format = this.editingSchema.format || this.editingSchema.type;

            let targetPlugin;
            if (format) {
                targetPlugin = this.plugins.find(plugin => {
                    const shouldUse = get(plugin, "form10.format.shouldUse");
                    if (shouldUse && shouldUse(this.editingSchema.form || {}, this.editingSchema)) {
                        return true;
                    }
                });
                if (!targetPlugin) {
                    targetPlugin = this.plugins.find(plugin => {
                        return get(plugin, "form10.format.name") === format;
                    });
                }
            }

            const ret = {
                type: "object",
                properties: Object.assign({}, this.commonSchema, this.typeSchema[this.editingSchema.type])
            };

            const pluginSchema = targetPlugin.form10.schema;
            if (pluginSchema) {
                pluginSchema.title = "特有属性";
                ret.properties.form = pluginSchema;
            }
            return ret;
        }
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
            console.log(rag);
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
                form: {
                    titleMap: ["object", "array", "string", "boolean", "number"].map(type => ({
                        value: type,
                        name: this.$t(type)
                    }))
                }
            },
            description: {
                type: "string",
                title: "描述"
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
            editResult: null
        };
    },
    methods: {
        editSubmit() {
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
