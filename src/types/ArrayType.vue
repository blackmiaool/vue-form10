<template>
    <TypeWrapper :form="form" ref="typeWrapper">
        <draggable class="list-group" slot="input"
            element="ol" :list="model" :options="{animation: 150,handle:'.sort-handle'}">
            <li v-for="(item,key) in model" :key="key"
                class="list-group-item">
                <AnyType :options="options" :name="key" :sf-form="form.schema.items"
                    :sf-model.sync="model[key]"
                />
                <i class="el-icon-sort sort-handle"></i>
                <i class="el-icon-delete delete-btn" @click="deleteItem(key)"></i>
            </li>
        </draggable>
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
        this.$options.components.AnyType = require("../components/AnyType").default;
    },
    mounted() {
        setTimeout(() => {
            this.model.splice(0, 0, ...this.model.splice(1, 1));
        }, 1000);
    },
    props: [],
    data() {
        return {};
    },
    methods: {
        deleteItem(key) {
            this.model.splice(key, 1);
        }
    },
    components: { draggable }
};
</script>


<style scoped lang="less">
.list-group {
    box-sizing: border-box;
    overflow: auto;
    margin: 0;
    width: 100%;
    list-style-type: none;
    margin-right: 0;
    margin-left: 0;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    .list-group-item {
        position: relative;
        > .delete-btn {
            position: absolute;
            top: 4px;
            right: 1px;
            color: #555;
            cursor: pointer;
        }
        >.sort-handle{
            position: absolute;
            top: 4px;
            right: 18px;
            color: #555;
            cursor: pointer;
        }
    }
}
</style>
