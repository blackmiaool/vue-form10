import { schemaDefaults } from "json-schema-form-core";
import TypeWrapper from "../components/TypeWrapper";

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
            const form = schemaDefaults.stdFormObj(this.name, this.sfForm);
            if (form.schema.format) {
                form.type = form.schema.format;
            }
            if (this.sfForm['x-schema-form']) {
                Object.assign(form, this.sfForm['x-schema-form']);
            }
            return form;
        },
    },
    props: ['sf-model', 'sf-form', "options", "name"],
    components: { TypeWrapper }
};

