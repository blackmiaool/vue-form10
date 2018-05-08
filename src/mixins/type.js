import { set, get } from 'lodash';
import Ajv from "ajv";
import TypeWrapper from "../components/TypeWrapper";


function execWith(expression, context) {
    const keys = Object.keys(context);
    // eslint-disable-next-line
    const func = new Function(...keys, expression);
    func(...keys.map(key => context[key]));
}
export function stdFormObj(name, schema, options) {
    // from json-schema-form-core
    options = options || {};

    // The Object.assign used to be a angular.copy. Should work though.
    const f = options.global && options.global.formDefaults ?
        Object.assign({}, options.global.formDefaults) : {};
    if (options.global && options.global.supressPropertyTitles === true) {
        f.title = schema.title;
    } else {
        f.title = schema.title || name;
    }

    if (schema.description) { f.description = schema.description; }
    if (options.required === true || schema.required === true) { f.required = true; }
    if (schema.maxLength) { f.maxlength = schema.maxLength; }
    if (schema.minLength) { f.minlength = schema.minLength; }
    if (schema.readOnly || schema.readonly) { f.readonly = true; }
    if (schema.minimum) { f.minimum = schema.minimum + (schema.exclusiveMinimum ? 1 : 0); }
    if (schema.maximum) { f.maximum = schema.maximum - (schema.exclusiveMaximum ? 1 : 0); }
    f.schema = schema;
    return f;
}
export default {
    inject: ["rootModel"],
    methods: {
        interpolate(str, context) {
            if (typeof str === 'function') {
                return str(context);
            }
            // or it must be string
            return str.replace(/{{([\s\S]*?)}}/g, (full, key) => {
                return `${get(context, key)}`;
            });
        }
    },
    watch: {
        model(value) {
            if (this.form.onChange) {
                const onChange = this.form.onChange;
                if (typeof onChange === 'function') {
                    onChange(value, this.form);
                } else if (typeof onChange === 'string') {
                    execWith(onChange, Object.assign(this.options.$rootParent, { modelValue: this.modelValue, form: this.form }));
                }
            }
            if (this.form.copyValueTo) {
                this.form.copyValueTo.forEach((path) => {
                    set(this.rootModel, path, value);
                });
            }

            const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
            if (this.type === 'object') {
                return;
            }

            const validate = ajv.compile(this.form.schema
            );
            const valid = validate(value);
            if (!valid) {
                this.$invalid = true;
                this.$refs.typeWrapper.errorMessage = ajv.errorsText(validate.errors);
                const keyword = validate.errors[0].keyword;
                const validationMessage = this.form.validationMessage;


                let errorMessage = '';
                if (validationMessage) {
                    const context = {
                        error: validate.errors,
                        title: this.form.schema.title,
                        value: this.model,
                        valueValue: this.model,
                        form: this.form,
                        schema: this.form.schema
                    };

                    if (typeof validationMessage === 'object' && validationMessage[keyword]) {
                        errorMessage = validationMessage[keyword];
                    } else {
                        errorMessage = validationMessage;
                    }

                    this.$refs.typeWrapper.errorMessage = this.interpolate(errorMessage, context);
                }
            } else {
                this.$invalid = false;
                this.$refs.typeWrapper.errorMessage = '';
            }
        }
    },
    computed: {
        type() {
            return this.form.type || this.form.schema.type;
        },
        modelValue() {
            return this.model;
        },
        model: {
            set(value) {
                this.$emit('update:sfModel', value);
            },
            get() {
                return this.sfModel;
            }
        },
        form() {
            const form = stdFormObj(this.name, this.sfForm);
            if (form.schema.format) {
                form.type = form.schema.format;
            }
            if (this.sfForm['x-schema-form']) {
                Object.assign(form, this.sfForm['x-schema-form']);
            }
            return form;
        },
    },
    data() {
        return {
            $errorMessage: 'a',
            $invalid: false
        };
    },
    props: ['sf-model', 'sf-form', "options", "name"],
    components: { TypeWrapper }
};

