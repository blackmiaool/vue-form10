<template>
    <TypeWrapper :form="form">
        <ol class="list-group" slot="input" style="overflow: auto;">
            <li class="list-group-item">
                <AnyType v-for="(item,key) in model"
                    :options="options" :key="key"
                    :name="key" :sf-form="form.schema.items"
                    :sf-model.sync="model[key]"
                />
            </li>
        </ol>
    </TypeWrapper>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "ArrayType",
    mixins: [Type],
    beforeCreate() {
        // eslint-disable-next-line
        this.$options.components.AnyType = require("./AnyType").default;
    },
    mounted() {
        console.log('array', this.form);
    },
    props: [],
    data() {
        return {};
    },
    components: {}
};
</script>


<style scoped>

</style>
