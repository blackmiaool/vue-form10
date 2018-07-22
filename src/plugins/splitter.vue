<template>
    <TypeWrapper v-bind="typeWrapperProps" hide-title  ref="typeWrapper">
        <template slot="input">
            <div class="splitter"></div>
        </template>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";
import NullDefault from "./null";

export default {
    name: "splitter-format",
    mixins: [FormatMixin],
    extends: NullDefault,
    form10: {
        format: {
            name: 'splitter',
            types: ['null'],
        },
    },
};
</script>
<style lang="less" scoped>
.splitter{
    background-color: #f2f5f5;
    height: 10px;
}
</style>

