<template>
    <component
        v-if="condition"
        :is="componentId"
        :sf-form="sfForm"
        :sf-model.sync="model"
        :options="options"
        :name="name"
    ></component>

</template>

<script>
import Type from "../mixins/type";
import ObjectType from "./ObjectType";
import StringType from "./StringType";
import NumberType from "./NumberType";
import BooleanType from "./BooleanType";
import EnumType from "./EnumType";
import TimestampType from "./TimestampType";

export default {
    name: "AnyType",
    mixins: [Type],
    inject: ['rootModel'],
    computed: {
        componentId() {
            const form = this.form;
            if (!this.sfForm || !Object.keys(this.sfForm).length) {
                return null;
            }
            const type = form.type || form.schema.type;
            if (type === "object") {
                return "ObjectType";
            } else if (type === "string") {
                if (form.schema.enum) {
                    return "EnumType";
                }
                return "StringType";
            } else if (type === "number") {
                return "NumberType";
            } else if (type === "boolean") {
                return "BooleanType";
            } else if (type === 'timestamp') {
                return "TimestampType";
            }
            console.error(`can't decide the type of `, this.sfForm, type, this);

            return "label";
        },
        condition() {
            console.log(this.rootModel, this.form);
            if (this.form.condition) {
                // eslint-disable-next-line
                return new Function("model", `return ${this.form.condition};`)(this.rootModel);
            }
            return true;
        }
    },
    mounted() {

    },
    props: [],
    data() {
        return {
            compForm: {}
        };
    },
    components: { ObjectType, StringType, BooleanType, NumberType, EnumType, TimestampType }
};
</script>


<style scoped>

</style>
