<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <el-select v-model="model" :placeholder="form.placeholder"
            slot="input" :disabled="schema.readOnly">
            <el-option v-for="(item,index) in titleMap"
                :key="index" :label="$t(item.name)"
                :value="schema.type==='number'?item.value*1:item.value">
            </el-option>
        </el-select>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "@/mixins/format";
import EnumMixin, { editorSchema } from "@/mixins/enum";

export default {
    name: "select-format",
    mixins: [FormatMixin, EnumMixin],
    form10: {
        format: {
            name: "select",
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
        formSchema: editorSchema
    },
};
</script>

