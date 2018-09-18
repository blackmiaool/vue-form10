<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper" hide-title>
        <div slot="input" v-if="model" class="jianyu-common-wrap">
            <section>
                <div>
                    <el-form-item label-width="auto" label="标题" :required="true">
                        <el-input v-model="model.title" :maxlength="form.title.maxlength"></el-input>
                    </el-form-item>
                </div>
                <div v-if="schema.properties&&schema.properties.description">
                    <el-form-item label-width="auto" label="描述">
                        <el-input v-model="model.description"></el-input>
                    </el-form-item>
                </div>

            </section>
            <section v-for="(key,$index) in keys" :key="key">
                <AnyType v-bind="getChildProps1($index,key)" />
            </section>
        </div>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";
import HybridMixin from "../mixins/hybrid";
import ObjectFormat from "./object";

export default {
    name: "Schema",
    mixins: [FormatMixin, HybridMixin],
    extends: ObjectFormat,
    form10: {
        format: {
            name: "schema",
            title: "schema",
            types: ["object"],
            properties(schema) {
                const properties = {
                    title: {
                        type: "string",
                        default: '',
                        title: "标题",
                        required: true
                    },
                };
                if (schema.form && schema.form.showDescription) {
                    properties.description = {
                        type: 'string',
                        default: '',
                        title: '描述'
                    };
                }
                return properties;
            }
        },
        formSchema: {
            type: "object",
            properties: {
                showDescription: {
                    title: "展示描述",
                    type: "boolean"
                },
            }
        }
    },
    methods: {
        getChildProps1(...args) {
            const ret = this.getChildProps(...args);
            ret.margin = "0px";
            return ret;
        }
    },
};
</script>
<style lang="less" scoped>
.jianyu-common-wrap {
    background-color: #f2f5f5;
    > section {
        > div:not(:last-child) {
            margin-bottom: 10px;
        }
        padding: 15px;
        background-color: white;
        margin-bottom: 10px;
    }
}
.el-form-item .el-form-item{
    margin-bottom: 10px;
}
</style>

