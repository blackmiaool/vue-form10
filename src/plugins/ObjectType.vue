<template>
    <TypeWrapper :form="form" :hide-title="true"
        ref="typeWrapper">
        <div slot="input">
            <fieldset v-if="name!==undefined&&name!==null&&parent!=='array'">
                <legend>{{form.title}}</legend>
                <AnyType v-for="(key,$index) in keys"
                    :key="key"
                    v-bind="getChildProps($index,key)"/>
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
import Type from "../mixins/type";

export default {
    name: "ObjectType",
    form10: {
        type: 'object',
    },
    mixins: [Type],
    beforeCreate() {
        // eslint-disable-next-line
        this.$options.components.AnyType = require("../components/AnyType").default;
    },
    methods: {
        remove(model, key) {
            delete model[key];
        },
        getChildProps($index, key) {
            return {
                sfSchema: this.form.schema.properties[key],
                name: key,
                isLast: $index === this.keys.length - 1,
                parent: "object",
                options: this.options,
                parentPath: this.path,
                'v-on:remove': () => this.remove(this.model, key)
            };
        }
    },
    beforeMount() {
        if (!this.model || typeof this.model !== 'object') {
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
