<template>
    <TypeWrapper :form="form"  ref="typeWrapper">
        <el-select v-model="model" :placeholder="form.placeholder"
            slot="input" clearable :disabled="form.readonly">
            <el-option v-for="(item,index) in titleMap"
                :key="index" :label="item.name"
                :value="item.value">
            </el-option>
        </el-select>
    </TypeWrapper>
</template>

<script>
import { Select, Option } from 'element-ui';

export default {
    name: "EnumType",
    form10: {
        format: { name: 'select', format: "" },
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
            } else if (this.form.schema.enum) {
                arr = this.form.schema.enum.map(name => {
                    return { value: name, name };
                });
            }
            return arr;
        }
    },
    components: {
        'el-select': Select,
        'el-option': Option
    }
};
</script>


<style scoped>

</style>
