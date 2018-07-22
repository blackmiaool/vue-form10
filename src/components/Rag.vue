<template>
    <section>
        <el-card class="rag-card box-card">
            <h3 slot="header" class="header">
                <span class="title">{{schema.title}}</span>
                <div class="tools">
                    <!-- <i :title="$t('move up')" class="clickable el-icon-caret-top"></i>
                    <i :title="$t('move down')" class="clickable el-icon-caret-bottom"></i> -->
                    <i :title="$t('delete')" class="clickable el-icon-delete" style="color:#F56C6C"
                        @click="remove()"></i>
                </div>
            </h3>
            <section>
                <span class="type">
                    <label>Type: </label>{{schema.type}}</span>
                <span class="format">
                    <label>Format: </label>{{schema.format}}</span>
            </section>
            <section v-if="isContainer">
                <draggable class="draggable" v-model="schema.rags"
                    :options="draggableOptions">
                    <Rag v-for="(schema,i) in schema.rags" :key="i"
                        class="item" :schema='schema'>
                    </Rag>
                </draggable>
            </section>
        </el-card>
    </section>
</template>

<script>
export default {
    name: "Rag",
    inject: ["draggableOptions", "eventHub"],
    props: {
        schema: {
            type: Object
        }
    },
    methods: {
        async remove() {
            try {
                await this.$confirm(this.$t('deleteConfirm'), this.$t("Warning"), {
                    confirmButtonText: this.$t("OK"),
                    cancelButtonText: this.$t("Cancel"),
                    type: "warning"
                });
                this.eventHub.$emit("remove", this.schema.form10uid);
            } catch (e) {
                // nothing
            }
        }
    },
    computed: {
        isContainer() {
            return this.schema.type === "object" || this.schema.type === "array";
        }
    },
    data() {
        return {};
    }
};
</script>

<style scoped lang="less">
.box-card {
    margin-bottom: 10px;
}
.header {
    margin: 0;
    &:hover {
        .tools {
            display: inline-block;
        }
    }
    .tools {
        display: none;
        float: right;
    }
}
.type {
    display: inline-block;
    width: 120px;
}

.draggable {
    min-height: 100px;
    background-color: #f3f3f3;
    padding: 10px;
}
.clickable {
    cursor: pointer;
    user-select: none;
}
</style>
