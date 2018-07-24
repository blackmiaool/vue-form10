<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <div slot="input">
            <el-input type="textarea"
                v-model="model" slot="input" :placeholder="form.placeholder"
                :disabled="schema.readOnly">
            </el-input>
        </div>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";

export default {
    name: "TextAreaFormat",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: "textarea",
            types: ['string'],
        }
    },

    methods: {
        onValidateMessage(msg) {
            this.$alternativeErrorMessage = msg;
        }
    },
};
</script>
