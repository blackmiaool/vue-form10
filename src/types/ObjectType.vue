<template>
    <TypeWrapper :form="form" :hide-title="true">
        <div slot="input">
            <fieldset v-if="name">
                <legend>{{form.title}}</legend>
                <AnyType v-for="(item,key) in form.schema.properties"
                    :options="options" :key="key"
                    :name="key" :sf-form="item"
                    :sf-model.sync="model[key]"
                    @remove="remove(model,key)"
                />
            </fieldset>
            <template v-else>
                <AnyType v-for="(item,key) in form.schema.properties"
                    :options="options" :key="key"
                    :name="key" :sf-form="item"
                    :sf-model.sync="model[key]"
                    @remove="remove(model,key)"
                />
            </template>

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
        this.$options.components.AnyType = require("../components/AnyType").default;
    },
    mounted() {},
    props: [],
    methods: {
        remove(model, key) {
            delete model[key];
        }
    },
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
