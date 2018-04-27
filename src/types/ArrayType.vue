<template>
    <TypeWrapper :form="form">
        <ol class="list-group" slot="input" style="overflow: auto;margin:0;width:100%;">

            <draggable element="el-collapse" :list="model">
                <li v-for="(item,key) in model" :key="key"
                    class="list-group-item">
                    <AnyType :options="options" :name="key" :sf-form="form.schema.items"
                        :sf-model.sync="model[key]"
                    />
                </li>
            </draggable>
        </ol>
    </TypeWrapper>
</template>

<script>

import draggable from "vuedraggable";
import Type from "../mixins/type";


export default {
    name: "ArrayType",
    mixins: [Type],
    beforeCreate() {
        // eslint-disable-next-line
        this.$options.components.AnyType = require("./AnyType").default;
    },
    mounted() {
        console.log("array", this.form);
    },
    props: [],
    data() {
        return {};
    },
    components: { draggable }
};
</script>


<style scoped>

</style>
