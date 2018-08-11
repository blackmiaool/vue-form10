<template>
    <TypeWrapper v-bind="typeWrapperProps" :hide-title="true" ref="typeWrapper">
        <div slot="input" class="format-list">
            <draggable v-model="form.model" :options="draggableOptions" :clone="clone">
                <template v-for="(section,$index) in schema.properties">
                    <el-card :key="$index" class="rag-card box-card">
                        <h3 slot="header" style="margin:0;">{{section.title}}</h3>
                        <section >
                            <AnyType v-bind="getSectionChildProps($index,$index)" />
                        </section>
                    </el-card>
                </template>
            </draggable>
        </div>
    </TypeWrapper>
</template>

<script>
// import Form10 from "@/components/Form10";
import FormatMixin from "@/mixins/format";
import ObjectType from "./object";
import { assignDeep, getPluginFromSchemaAndPlugins } from "../util";

export default {
    name: "drag-list-format",
    mixins: [FormatMixin],
    inject: ['plugins'],
    form10: {
        format: {
            name: 'drag-list',
            types: ['object'],
        },
    },
    extends: ObjectType,
    methods: {
        clone(obj) {
            const ret = JSON.parse(JSON.stringify(obj));

            delete ret.form.notitle;
            const plugin = getPluginFromSchemaAndPlugins(obj, this.plugins);

            if (plugin.form10.defaultSchema) {
                assignDeep(ret, plugin.form10.defaultSchema);
            }
            return ret;
        },
        getSectionChildProps($index, key) {
            const props = this.getChildProps($index, key);
            return props;
        }
    },
    data() {
        return {
            draggableOptions: {
                group: { name: 'a', pull: 'clone', push: false },
                sort: false,
            }
        };
    },
    computed: {}
};
</script>
<style scoped lang="less">
.rag-card{
    margin-bottom: 10px;
}

section{
    pointer-events: none;
}
</style>
<style lang="less">
.format-list{
    .el-card__header{
        padding:8px 12px;
    }
    .el-card__body{
        padding:10px;
    }
}
</style>
