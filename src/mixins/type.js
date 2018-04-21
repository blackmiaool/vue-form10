import { schemaDefaults } from "json-schema-form-core";

export default {
    computed: {
        model: {
            set(value) {
                this.$emit('update:sfModel', value);
            },
            get() {
                return this.sfModel;
            }
        },
        form() {
            return schemaDefaults.stdFormObj(this.name, this.sfForm);
        },
    },
    props: ['sf-model', 'sf-form', "options", "name"]
};

