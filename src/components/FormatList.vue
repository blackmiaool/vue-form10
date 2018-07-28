<template>
    <div>
        <header class="format-list-header">
            <span class="tag el-tag" v-for="tab in tabs" :key="tab" :class="{active:tab===activeTab}" @click="activeTab=tab">
               <i :class="tabIcon[tab]"/> {{$t(tab)}}
            </span>
        </header>
        <Form10 ref="form10" :schema="schema" v-model="model" :options="options" :plugins="plugins" />
    </div>
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
                if (!(format.types.includes(this.activeTab) || this.activeTab === 'decoration' && format.types.includes('null'))) {
                    return;
                }
                if (format.name === "drag-list") {
                    return;
                }
                const that = this;
                function getType() {
                    if (that.activeTab === 'decoration') {
                        return 'null';
                    } else if (that.activeTab === 'number') {
                        if (format.types.includes('number')) {
                            return 'number';
                        }
                        if (format.types.includes('integer')) {
                            return 'integer';
                        }
                    }
                    return that.activeTab;
                }
                let schema = {
                    title: this.$t(format.name),
                    format: format.name,
                    type: getType(),
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
            },
            tabs: ["object", "array", "string", "boolean", "number", "decoration"],
            activeTab: "object",
            tabIcon: {
                object: 'el-icon-goods',
                array: 'el-icon-sort',
                string: 'el-icon-edit-outline',
                boolean: 'el-icon-bell',
                number: 'el-icon-sort-up',
                decoration: 'el-icon-news'
            }
        };
    },
    components: {
        Form10
    }
};
</script>
<style lang="less">
.format-list-header {
    display: flex;
    flex-wrap: wrap;

    > .tag {
        flex:1;
        flex-basis: 30%;
        text-align: center;
        display: inline-block;
        margin:5px;
        cursor: pointer;
        &.active{
            color:white;
            background-color:#409EFF;
        }
    }
}
</style>

