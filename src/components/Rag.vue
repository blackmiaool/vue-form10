<template>
    <section>
        <el-card class="rag-card box-card">
            <header slot="header" class="card-header">
                <h3 class="header-cover">
                    <span class="title">{{schema.title}}</span>
                    <span class="form10key" v-if="!root">{{schema.form10key}}</span>
                </h3>
                <div class="header-hover">
                    <div class="input-wrap">
                        <el-input class="title" v-model="schema.title">
                        </el-input>
                        <label slot="prefix" class="input-prefix">{{$t('title')}}</label>
                    </div>
                    <div class="input-wrap" v-if="!root">
                        <el-input class="form10key" v-model="schema.form10key">

                        </el-input>
                        <label slot="prefix" class="input-prefix">{{$t('key')}}</label>
                    </div>

                </div>
            </header>

            <section>
                <span class="type">
                    <label>Type: </label>{{$t(schema.type)}}</span>
                <span class="format">
                    <label>Format: </label>{{$t(schema.format)}}</span>
                <div class="tools">
                    <!-- <i :title="$t('move up')" class="clickable el-icon-caret-top"></i>
                        <i :title="$t('move down')" class="clickable el-icon-caret-bottom"></i> -->
                    <i :title="$t('edit')" class="clickable el-icon-edit"
                        style="color:#409EFF"
                        @click="edit()"></i>
                    <i :title="$t('delete')" class="clickable el-icon-delete"
                        style="color:#F56C6C"
                        @click="remove()"></i>
                </div>
            </section>
            <section v-if="isContainer">
                <draggable class="draggable" v-model="schema.rags"  @change="onChange"
                    :options="draggableOptions">
                    <Rag v-for="(schema,i) in schema.rags" :key="i"
                        class="item" :schema='schema'  :plugins="plugins">
                    </Rag>
                </draggable>
            </section>
        </el-card>
    </section>
</template>

<script>
import { getPluginFromSchemaAndPlugins } from "@/util";

export default {
    name: "Rag",
    inject: ["draggableOptions", "eventHub"],
    props: {
        schema: {
            type: Object
        },
        root: {
            type: Boolean,
            default: false
        },
        plugins: {
            type: Array
        }
    },
    methods: {
        onChange(event) {
            this.eventHub.$emit('change', event);
        },
        updateTitle() {},
        async remove() {
            try {
                await this.$confirm(this.$t("deleteConfirm"), this.$t("Warning"), {
                    confirmButtonText: this.$t("OK"),
                    cancelButtonText: this.$t("Cancel"),
                    type: "warning"
                });
                this.eventHub.$emit("remove", this.schema.form10uid);
            } catch (e) {
                // nothing
            }
        },
        edit() {
            this.eventHub.$emit('edit', this.schema.form10uid);
        }
    },
    watch: {
        "schema.form": {
            immediate: true,
            deep: true,
            handler() {
                ['properties', 'items'].forEach((key) => {
                    let child = this.targetPlugin.form10.format[key];

                    if (child) {
                        if (typeof child === 'function') {
                            child = child(this.schema);
                        }
                        this.$set(this.schema, key, child);
                    }
                });
            }
        }
    },
    computed: {
        targetPlugin() {
            return getPluginFromSchemaAndPlugins(this.schema, this.plugins);
        },
        isContainer() {
            return (this.schema.type === "object" || this.schema.type === "array") && !this.schema.sealed;
        }
    },
    data() {
        return {};
    }
};
</script>

<style scoped lang="less">
.box-card {
    margin-bottom: 10px;
    .card-header {
        &:hover {
            .header-cover {
                display: none;
            }
            .header-hover {
                display: block;
            }
            .tools {
                visibility: visible;
            }
        }
        .input-wrap {
            display: inline-block;
            width:50%;
            position: relative;
            .input-prefix {
                position: absolute;
                top: -6px;
                color: #333;
                font-size: 12px;
                white-space: nowrap;
                left: 10px;
                padding:0 2px;
                background-color: white;
                line-height: 1.4;
            }
        }
    }
    .tools {
        // visibility: hidden;
        padding-top: 10px;
        padding-bottom: 3px;
        text-align: right;
    }
}
.header-hover,
.header-cover {
    font-size: 0;
    .title {
        font-size: 16px;
    }
    .form10key {
        font-size: 16px;
        font-weight: normal;
    }
}
.header-hover {
    display: none;
    .title {
        display: inline-block;
        > * {
            padding-left: 15px !important;
        }
    }
    .form10key {
        display: inline-block;
    }
}
.header-cover {
    margin: 0;
    height: 40px;
    display: flex;
    align-items: center;
    .title {
        margin-right: 10px;
    }
}
.type {
    display: inline-block;
    width: 120px;
}

.draggable {
    min-height: 100px;
    background-color: #f3f3f3;
    padding: 10px;
}
.clickable {
    cursor: pointer;
    user-select: none;
}
</style>
