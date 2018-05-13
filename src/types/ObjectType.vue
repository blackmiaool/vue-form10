<template>
    <TypeWrapper :form="form" :hide-title="true"
        ref="typeWrapper">
        <div slot="input">
            <fieldset v-if="name!==undefined&&name!==null">
                <legend>{{form.title}}</legend>
                <AnyType v-for="(key,$index) in keys"
                    :options="options" :key="key"
                    :name="key" :sf-form="form.schema.properties[key]"
                    :sf-model.sync="model[key]"
                    @remove="remove(model,key)"
                    :is-last="$index===keys.length-1"
                    parent="object" />
            </fieldset>
            <template v-else>
                <AnyType v-for="(key,$index) in keys"
                    :options="options" :key="key"
                    :name="key" :sf-form="form.schema.properties[key]"
                    :sf-model.sync="model[key]"
                    @remove="remove(model,key)"
                    :is-last="$index===keys.length-1"
                    parent="object" />
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
    props: [],
    methods: {
        remove(model, key) {
            delete model[key];
        }
    },
    computed: {
        keys() {
            if (this.form.schema.properties) {
                return Object.keys(this.form.schema.properties);
            }
            return [];
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
