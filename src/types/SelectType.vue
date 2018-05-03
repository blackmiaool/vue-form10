<template>
    <TypeWrapper :form="form">
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
import Type from "../mixins/type";

export default {
    name: "EnumType",
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
    mounted() {
        console.log(this);
    },
    mixins: [Type],
    props: [],
    data() {
        return {};
    }
};
</script>


<style scoped>

</style>
