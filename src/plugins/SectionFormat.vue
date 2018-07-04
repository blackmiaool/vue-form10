<template>
    <TypeWrapper v-bind="typeWrapperProps" :hide-title="true"
        ref="typeWrapper">
        <div slot="input">
            <fieldset v-if="name!==undefined&&name!==null&&parent!=='array'">
                <legend>{{form.title}}</legend>
                <template v-for="(keys,$groupIndex) in form.keys" >
                    <section :key="$groupIndex">
                        <AnyType v-for="(key,$index) in keys"
                        :key="key"
                        v-bind="getSectionChildProps($index,key,$groupIndex)"/>
                    </section>
                    <div :key="$groupIndex+'-spliter'" v-if="$groupIndex!==form.keys.length-1" class="form10-section-format-splitter"></div>
                </template>
            </fieldset>
            <template v-else>
                <template v-for="(keys,$groupIndex) in form.keys" >
                    <section :key="$groupIndex">
                        <AnyType v-for="(key,$index) in keys"
                        :key="key"
                        v-bind="getSectionChildProps($index,key,$groupIndex)"/>
                    </section>
                    <div :key="$groupIndex+'-spliter'" v-if="$groupIndex!==form.keys.length-1" class="form10-section-format-splitter"></div>
                </template>
            </template>

        </div>

    </TypeWrapper>
</template>

<script>
import ObjectType from "./ObjectType";
import FormatMixin from "../mixins/format";

export default {
    name: "SectionFormat",
    mixins: [FormatMixin],
    form10: {
        format: { name: 'section', format: "" },
    },
    extends: ObjectType,
    methods: {
        getSectionChildProps($index, key) {
            const props = this.getChildProps($index, key);
            props.margin = '0px 0px 0px 0px';
            return props;
        }
    },
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


<style scoped lang="less">
fieldset {
    border: 1px solid #dcdfe6;
    border-width: 1px;
    border-radius: 4px;
    margin-left: 0;
    padding:0;
    section{
        padding-top:0px;
    }
}
legend {
    margin-left:6px;
    color: #606266;
}
.form10-section-format-splitter{
    background-color: #f2f5f5;
    height:10px;
}
section{
    padding:15px 10px;
}
</style>
