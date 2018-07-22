import get from 'lodash/get';
import toPath from "lodash/toPath";
import { mapState } from 'vuex';
import TypeWrapper from "../components/TypeWrapper";
import AnyType from "../components/AnyType";
import { stdFormObj } from "../util";

function execWith(expression, context) {
    const keys = Object.keys(context);
    // eslint-disable-next-line
    const func = new Function(...keys, expression);
    func(...keys.map(key => context[key]));
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


                if (this.type === 'object' || this.type === 'array' || this.schema.type === 'object' || this.schema.type === 'array') {
                    return;
                }
                const schema = JSON.parse(JSON.stringify(this.schema));
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

                const error = this.options.tv4.error;
                this.$nextTick(() => {
                    let validateState;
                    let validateMessage;
                    if (!valid) {
                        validateState = 'error';
                        validateMessage = error.message;
                        const keyword = error.schemaPath.slice(1);
                        const validationMessage = this.form.validationMessage;
                        let errorMessage = '';
                        if (validationMessage) {
                            const context = {
                                error,
                                title: this.schema.title,
                                value: this.model,
                                valueValue: this.model,
                                form: this.form,
                                schema: this.schema
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
                            typeWrapper.$refs.formItem.validateMessage = '';
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
            return this.form.type || this.schema.type;
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
        schema() {
            return this.sfSchema;
        },
        form() {
            const form = stdFormObj(this.name, this.sfSchema);
            if (this.sfSchema.form) {
                Object.assign(form, this.sfSchema.form);
            }
            return form;
        },
        typeWrapperProps() {
            return {
                form: this.form,
                margin: this.margin,
                schema: this.schema
            };
        }
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
    props: ['sf-schema', "options", "name", 'parent', 'is-last', 'path', 'margin'],
    components: { TypeWrapper, AnyType }
};

