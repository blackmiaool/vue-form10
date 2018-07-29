<template>
    <TypeWrapper v-bind="typeWrapperProps" :hide-title="true"
        ref="typeWrapper">
        <div slot="input">
            <fieldset v-if="useFieldset">
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
import FormatMixin from "../mixins/format";

export default {
    name: "object-default",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: 'object',
            types: ['object'],
        },
    },
    methods: {
        getChildProps($index, key) {
            const isLast = $index === this.keys.length - 1;
            let margin = '0px';
            if (this.form.layout !== 'half' && !isLast) {
                margin = '0px 0px 15px 0px';
            }

            return {
                schema: this.schema.properties[key],
                name: key,
                isLast: $index === this.keys.length - 1,
                parent: "object",
                options: this.options,
                parentPath: this.path,
                margin,
                style: this.childStyle
            };
        }
    },
    beforeMount() {
        if (!this.model || typeof this.model !== 'object') {
            this.model = {};
        }
    },
    computed: {
        childStyle() {
            if (this.form.layout === 'half') {
                return "width:50%;display:inline-block;padding:5px;box-sizing:border-box;";
            }
        },
        useFieldset() {
            return this.name !== undefined && this.name !== null && this.parent !== 'array' && !this.form.strip;
        },
        keys() {
            if (this.form.keys) {
                return this.form.keys;
            }
            if (this.schema.properties) {
                return Object.keys(this.schema.properties);
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
