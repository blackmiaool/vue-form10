<template>
    <TypeWrapper :form="form" ref="typeWrapper">
        <div slot="input" class="array-wrap">
            <draggable class="list-group" element="ol"
                :list="model" :options="{animation: 150,handle:'.sort-handle'}">
                <li v-for="(item,key) in model" :key="key"
                    class="list-group-item">
                    <AnyType :options="options" :name="key" :sf-form="form.schema.items"
                        :sf-model.sync="model[key]"
                    />
                    <i class="el-icon-sort sort-handle" :title="'drag to sort (index:'+key+')'"></i>
                    <i class="el-icon-delete delete-btn" @click="deleteItem(key)"
                        title="delete"></i>
                </li>
            </draggable>
            <el-button type="default" class="add-btn" @click="addItem"><i class="el-icon-plus"></i> Add</el-button>
        </div>

    </TypeWrapper>
</template>

<script>
import draggable from "vuedraggable";
import Type from "../mixins/type";
import { getDefaultFromSchema } from "@/util";

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
        addItem() {
            const defaultData = getDefaultFromSchema(this.form.items);
            this.model.push(defaultData);
        },
        deleteItem(key) {
            this.model.splice(key, 1);
        }
    },
    components: { draggable }
};
</script>


<style scoped lang="less">
.array-wrap{
    overflow: auto;
    .add-btn{
        float: right;
        margin-top:10px;
    }
}
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
        > .sort-handle {
            position: absolute;
            top: 4px;
            right: 18px;
            color: #555;
            cursor: move;
        }
    }
}
</style>
