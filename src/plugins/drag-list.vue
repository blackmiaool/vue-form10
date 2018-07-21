<template>
    <!-- <TypeWrapper v-bind="typeWrapperProps" hide-title  ref="typeWrapper">
        <template slot="input">

        </template>
    </TypeWrapper> -->
    <TypeWrapper v-bind="typeWrapperProps" :hide-title="true" ref="typeWrapper">
        <div slot="input" class="format-list">
            <draggable v-model="form.model" :options="draggableOptions">
                <!-- <div v-for="element in myArray" :key="element.id">
                    {{element.name}}
                </div>
                <button slot="footer" @click="addPeople">Add</button> -->
                <template v-for="(section,$index) in schema.properties">
                    <el-card :key="$index" class="box-card">
                        <h3 slot="header" style="margin:0;">{{section.title}}</h3>
                        <section >
                            <AnyType v-bind="getSectionChildProps($index,$index)" />
                        </section>
                    </el-card>
                </template>
            </draggable>
        </div>
    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";
import ObjectType from "./object";

export default {
    name: "drag-list-format",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: 'drag-list',
            types: ['object'],
        },
    },
    extends: ObjectType,
    methods: {
        getSectionChildProps($index, key) {
            const props = this.getChildProps($index, key);
            return props;
        }
    },
    data() {
        return {
            draggableOptions: {
                sort: false
            }
        };
    },
    computed: {}
};
</script>
<style scoped lang="less">
.box-card{
    margin-bottom: 10px;
}
.format-list{
    .el-card__header{
        padding:8px 12px;
    }
    .el-card__body{
        padding:10px;
    }
}
section{
    pointer-events: none;
}
</style>
<style lang="less">
.format-list{
    .el-card__header{
        padding:8px 12px;
    }
    .el-card__body{
        padding:10px;
    }
}
</style>
