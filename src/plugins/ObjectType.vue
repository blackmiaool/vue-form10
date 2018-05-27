<template>
    <TypeWrapper :form="form" :hide-title="true"
        ref="typeWrapper">
        <div slot="input" v-if="model">
            <fieldset v-if="name!==undefined&&name!==null&&parent!=='array'">
                <legend>{{form.title}}</legend>
                <AnyType v-for="(key,$index) in keys" :options="options"
                :parent-path="path"
                    :key="key" :name="key" :sf-form="form.schema.properties[key]"
                    @remove="remove(model,key)"
                    :is-last="$index===keys.length-1"
                    parent="object" />
            </fieldset>
            <template v-else>
                <AnyType v-for="(key,$index) in keys" :parent-path="path"
                :options="options"
                    :key="key" :name="key" :sf-form="form.schema.properties[key]"

                    @remove="remove(model,key)"
                    :is-last="$index===keys.length-1"
                    parent="object" />
            </template>

        </div>

    </TypeWrapper>
</template>

<script>
export default {
    name: "ObjectType",
    form10: {
        type: 'object',
    },
    beforeCreate() {
        // eslint-disable-next-line
        this.$options.components.AnyType = require("../components/AnyType").default;
    },
    methods: {
        remove(model, key) {
            delete model[key];
        }
    },
    mounted() {
        if (!this.model) {
            this.model = {};
        }
    },
    computed: {
        keys() {
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
</style>
