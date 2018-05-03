<template>
    <TypeWrapper :form="form">
        <ol class="list-group" slot="input">
            <draggable element="li" :list="model" :options="{animation: 150}" v-for="(item,key) in model" :key="key"  class="list-group-item">
                <AnyType :options="options" :name="key" :sf-form="form.schema.items"
                        :sf-model.sync="model[key]"/>
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
ol {
    box-sizing: border-box;
    overflow: auto;
    margin: 0;
    width: 100%;
    padding-left: 0;
    list-style-type: none;
    margin-right: 0;
    margin-left: 0;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
}
</style>
