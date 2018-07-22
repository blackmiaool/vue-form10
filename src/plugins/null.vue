<template>
    <TypeWrapper v-bind="typeWrapperProps" hide-title  ref="typeWrapper">
        <template slot="input">
        </template>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";

export default {
    name: "null-default",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: 'null',
            types: ['null'],
        },
    },
};
</script>

