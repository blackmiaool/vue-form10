<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <div slot="input" class="array-wrap">
            <draggable v-if="model&&model.length" class="list-group"
                element="ol" :list="model" :options="{animation: 150,handle:'.sort-handle'}">
                <li v-for="(item,$index) in model" :key="$index"
                    class="list-group-item">
                    <AnyType :options="options" :sf-schema="form.schema.items"
                        :parent-path="path" parent="array"
                        :name="$index" :is-last="$index===model.length-1"
                        v-bind="getChildProps($index)"
                    />
                    <i class="el-icon-sort sort-handle" :title="'drag to sort (index:'+$index+')'"></i>
                    <i class="el-icon-delete delete-btn" @click="deleteItem($index)"
                        title="delete"></i>
                </li>
            </draggable>
            <el-button type="default" class="add-btn"
                @click="addItem">
                <i class="el-icon-plus"></i> Add</el-button>
        </div>

    </TypeWrapper>
</template>

<script>
import draggable from "vuedraggable";
import { getDefaultFromSchema } from "../util";
import FormatMixin from "../mixins/format";

export default {
    name: "array-default",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: 'array',
            types: ['array'],
        },
        schema: {
            type: "object",
            properties: {
                startEmpty: {
                    title: "是否一开始一项都没有",
                    type: "boolean",
                }
            },
        }
    },
    props: [],
    data() {
        return {};
    },
    mounted() {
        if (!this.model || !this.model.length) {
            if (this.form.startEmpty === false) {
                this.addItem();
            }
        }
    },
    methods: {
        addItem() {
            const defaultData = getDefaultFromSchema(this.form.schema.items);
            let model = this.model;
            if (!Array.isArray(model)) {
                model = [];
            }
            model.push(defaultData);
            this.model = model;
        },
        deleteItem(key) {
            this.model.splice(key, 1);
        },
        getChildProps($index) {
            return {
                margin: $index === this.model.length - 1 ? "0px" : "0px 0px 15px 0px "
            };
        }
    },
    components: { draggable }
};
</script>


<style scoped lang="less">
.array-wrap {
    overflow: auto;
    .add-btn {
        float: right;
        margin-top: 10px;
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
    padding-bottom: 15px;
    .list-group-item {
        position: relative;
        border-bottom: 1px solid #dcdfe6;
        margin-top: 5px;
        &:first-child {
            margin-top: 0;
        }
        &:last-child {
            border-bottom: none;
        }
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
