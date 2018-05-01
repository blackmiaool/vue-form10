<template>
    <TypeWrapper :form="form" :hide-title="true">
        <div slot="input">
            <fieldset v-if="name">
                <legend>{{form.title}}</legend>
                <AnyType v-for="(item,key) in form.schema.properties"
                :options="options"
                :key="key"
                :name="key"
                :sf-form="item"
                :sf-model.sync="model[key]"/>
            </fieldset>
            <AnyType  v-if="!name"
            v-for="(item,key) in form.schema.properties"
             :options="options"
             :key="key"
             :name="key"
             :sf-form="item"
             :sf-model.sync="model[key]"/>
        </div>
       
    </TypeWrapper>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "ObjectType",
    mixins: [Type],
    beforeCreate() {
        // eslint-disable-next-line
        this.$options.components.AnyType = require("./AnyType").default;
    },
    mounted() {},
    props: [],
    data() {
        return {};
    },
    components: {}
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
</style>
