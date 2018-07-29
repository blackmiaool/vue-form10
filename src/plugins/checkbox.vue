<template>
    <TypeWrapper v-bind="typeWrapperProps" hide-title ref="typeWrapper">
        <template slot="input">
            <el-checkbox v-if="schema.type==='boolean'" v-model="model" :disabled="schema.readOnly">{{$t(form.title)}}</el-checkbox>
            <div v-if="schema.type==='array'">
                <el-checkbox-group v-model="model">
                    <el-checkbox :disabled="schema.readOnly" v-for="(item,index) in titleMap" :key="index" :label="item.value">{{$t(item.name)}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </template>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "@/mixins/format";
import EnumMixin, { editorSchema } from "@/mixins/enum";

export default {
    name: "boolean-default",
    mixins: [FormatMixin, EnumMixin],
    form10: {
        format: {
            name: "checkbox",
            types: ["boolean", "array"]
        },
        preview: {
            sealed: true,
            schema: {
                form: {
                    titleMap: [{ value: "1", name: "a" }, { value: "2", name: "b" }, { value: "3", name: "c" }]
                }
            }
        },
        schema: editorSchema
    },
    beforeMount() {
        if (this.schema.type === "boolean" && typeof this.model !== "boolean") {
            this.model = false;
        } else if (this.schema.type === "array" && !Array.isArray(this.model)) {
            this.model = [];
        }
    }
};
</script>

