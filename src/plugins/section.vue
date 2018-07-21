<template>
    <TypeWrapper v-bind="typeWrapperProps" :hide-title="true" ref="typeWrapper">
        <div slot="input">
            <fieldset v-if="name!==undefined&&name!==null&&parent!=='array'">
                <legend>{{form.title}}</legend>
                <template v-for="(section,$groupIndex) in form.sections">
                    <section :key="$groupIndex" :class="{'form10-first-section':$groupIndex===0}">
                        <h3 v-if="section.title" style="margin:0;">{{section.title}}</h3>
                        <AnyType v-for="(key,$index) in section.keys" :key="key" v-bind="getSectionChildProps($index,key,$groupIndex)" />
                    </section>
                    <div :key="$groupIndex+'-spliter'" v-if="$groupIndex!==form.sections.length-1" class="form10-section-format-splitter"></div>
                </template>
            </fieldset>
            <template v-else>
                <template v-for="(section,$groupIndex) in form.sections">
                    <section :key="$groupIndex" :class="{'form10-first-section':$groupIndex===0}">
                        <h3 v-if="section.title" style="margin:0;">{{section.title}}</h3>
                        <AnyType v-for="(key,$index) in section.keys" :key="key" v-bind="getSectionChildProps($index,key,$groupIndex)" />
                    </section>
                    <div :key="$groupIndex+'-spliter'" v-if="$groupIndex!==form.sections.length-1" class="form10-section-format-splitter"></div>
                </template>
            </template>

        </div>

    </TypeWrapper>
</template>

<script>
import ObjectType from "./object";
import FormatMixin from "../mixins/format";

export default {
    name: "section-format",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: "section",
            format: "",
            types: ["object"],
            preview: {
                // schema: {
                //     type: "object",
                //     title: "obj",
                //     format: "section",
                //     form: {
                //         sections: [
                //             {
                //                 keys: ["a", "c"],
                //                 title: "a and c"
                //             },
                //             {
                //                 keys: ["b"],
                //                 title: "is b"
                //             }
                //         ]
                //     },
                //     properties: {
                //         a: {
                //             type: "string"
                //         },
                //         b: {
                //             type: "number"
                //         },
                //         c: {
                //             type: "string"
                //         }
                //     }
                // }
            }
        }
    },
    extends: ObjectType,
    methods: {
        getSectionChildProps($index, key) {
            const props = this.getChildProps($index, key);
            props.margin = "0px 0px 0px 0px";
            return props;
        }
    },
    computed: {}
};
</script>


<style scoped lang="less">
fieldset {
    border: 1px solid #dcdfe6;
    border-width: 1px;
    border-radius: 4px;
    margin-left: 0;
    padding: 0;
    section.form10-first-section {
        padding-top: 0px;
    }
}
legend {
    margin-left: 6px;
    color: #606266;
}
.form10-section-format-splitter {
    background-color: #f2f5f5;
    height: 10px;
}
section {
    padding: 7px 10px 10px;
}
</style>
