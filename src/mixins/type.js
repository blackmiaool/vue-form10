import get from 'lodash/get';
import toPath from "lodash/toPath";
import { mapState } from 'vuex';
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

    if (!schema) {
        return f;
    }

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
    methods: {
        interpolate(str, context) {
            if (typeof str === 'function') {
                return str(context);
            }
            // or it must be string
            if (!str) {
                return '';
            }
            return str.replace(/{{([\s\S]*?)}}/g, (full, key) => {
                return `${get(context, key)}`;
            });
        }
    },
    watch: {
        model: {
            immediate: true,
            handler(value, prev) {
                if (value === prev) {
                    return;
                }
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
                        this.$vuexSet(['model', ...toPath(path)].slice(), value);
                        // set(this.rootModel, path, value);
                    });
                }


                if (this.type === 'object' || this.type === 'array') {
                    return;
                }
                const schema = JSON.parse(JSON.stringify(this.form.schema));
                if (this.form.type) {
                    schema.format = this.form.type;
                }

                let valid;
                const isEmpty = value === undefined || value === null;
                if (isEmpty) {
                    valid = true;
                } else {
                    const tv4ValidateResult = this.options.tv4.validate(value, schema);
                    valid = tv4ValidateResult;
                }

                this.$nextTick(() => {
                    let validateState;
                    let validateMessage;
                    if (!valid) {
                        validateState = 'error';

                        const error = this.options.tv4.error;
                        validateMessage = error.message;
                        const keyword = error.schemaPath.slice(1);
                        const validationMessage = this.form.validationMessage;
                        let errorMessage = '';
                        if (validationMessage) {
                            const context = {
                                error,
                                title: this.form.schema.title,
                                value: this.model,
                                valueValue: this.model,
                                form: this.form,
                                schema: this.form.schema
                            };

                            if (typeof validationMessage === 'object' && validationMessage[keyword]) {
                                errorMessage = validationMessage[keyword];
                            } else if (typeof validationMessage === 'function') {
                                errorMessage = validationMessage;
                            }
                            if (errorMessage) {
                                validateMessage = this.interpolate(errorMessage, context);
                            }
                        }
                    } else if (isEmpty) {
                        validateState = null;
                    } else {
                        validateState = 'success';
                        validateMessage = '';
                    }
                    if (this.form.disableErrorState && validateState === 'error') {
                        validateState = null;
                    }
                    if (this.form.disableSuccessState && validateState === 'success') {
                        validateState = null;
                    }
                    const typeWrapper = this.$refs.typeWrapper;
                    if (typeWrapper) {
                        if (validateState === 'error') {
                            typeWrapper.$refs.formItem.validateMessage = validateMessage;
                            typeWrapper.$refs.formItem.validateState = 'error';
                        } else if (validateState === 'success') {
                            typeWrapper.$refs.formItem.validateState = '';
                            typeWrapper.$refs.formItem.validateState = 'success';
                        } else {
                            typeWrapper.$refs.formItem.validateMessage = '';
                            typeWrapper.$refs.formItem.validateState = '';
                        }
                    }
                    this.$validationState = validateState;
                });
            }
        }
    },
    computed: {
        ...mapState({
            rootModel: state => state.model
        }),
        type() {
            return this.form.type || this.form.schema.type;
        },
        modelValue() {
            return this.model;
        },
        model: {
            set(value) {
                this.$vuexSet(this.path.slice(), value);
            },
            get() {
                return get(this.$store.state, this.path);
            }
        },
        form() {
            const form = stdFormObj(this.name, this.sfSchema);
            if (form.schema.format) {
                form.type = form.schema.format;
            }
            if (this.sfSchema['x-schema-form']) {
                Object.assign(form, this.sfSchema['x-schema-form']);
            }
            return form;
        },
    },
    mounted() {
        if (this.sfSchema.default && this.model === undefined) {
            this.model = this.sfSchema.default;
        }
    },
    data() {
        return {
            $validateState: null,
            $errorMessage: 'a',
        };
    },
    props: ['sf-schema', "options", "name", 'parent', 'is-last', 'path'],
    components: { TypeWrapper }
};

