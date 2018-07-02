<template>
    <TypeWrapper :form="form" :hide-title="true"
        ref="typeWrapper">
        <div slot="input">
            <fieldset v-if="name!==undefined&&name!==null&&parent!=='array'">
                <legend>{{form.title}}</legend>
                <template v-for="(key,$index) in keys">
                    <AnyType
                    :key="key"
                    v-bind="getChildProps($index,key)"/>
                    <div :key="key+'-spliter'" v-if="$index!==keys.length-1" class="form10-section-format-splitter"></div>
                </template>

            </fieldset>
            <template v-else>
                <AnyType v-for="(key,$index) in keys"
                    :key="key"
                    v-bind="getChildProps($index,key)"/>
            </template>

        </div>

    </TypeWrapper>
</template>

<script>
import ObjectType from "./ObjectType";

export default {
    name: "SectionFormat",
    form10: {
        format: { name: 'section', format: "" },
    },
    extends: ObjectType,
    computed: {
        keys() {
            if (this.form.keys) {
                return this.form.keys;
            }
            if (this.form.schema.properties) {
                return Object.keys(this.form.schema.properties);
            }
            return [];
        },
    },
};
</script>


<style scoped>
fieldset {
    border: 1px solid #dcdfe6;
    border-width: 1px;
    border-radius: 4px;
    margin-left: 0;
}
legend {
    color: #606266;
}
.form10-section-format-splitter{
    background-color: #f2f5f5;
    height:10px;
    margin-left: -10px;
    margin-right:-10px;
}
</style>
