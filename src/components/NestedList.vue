<template>
    <draggable class="draggable" v-model="rags"
        :options="draggableOptions" :class="{empty:!rags.length}">
        <Rag v-for="schema in rags" :key="schema.form10uid"
            class="item" :schema='schema' :root="true">
        </Rag>
    </draggable>
</template>

<script>
import Vue from 'vue';
import Rag from "./Rag";

export function rag2schema(rag) {
    rag = JSON.parse(JSON.stringify(rag));
    if (rag.type === 'array') {
        let items;
        if (rag.rags.length > 1) {
            items = rag2schema({
                type: 'object',
                rags: rag.rags,
            });
        } else if (rag.rags.length === 1) {
            items = rag2schema(rag.rags[0]);
        }
        rag.items = items;
    } else if (rag.type === 'object') {
        rag.properties = {};
        rag.rags.forEach((child) => {
            const key = child.form10key || child.form10uid;
            rag.properties[key] = rag2schema(child);
        });
    }
    if (rag.type === rag.format) {
        delete rag.format;
    }
    if (rag.form && Object.keys(rag.form).length === 0) {
        delete rag.form;
    }
    delete rag.rags;
    delete rag.form10uid;
    delete rag.form10key;
    return rag;
}
function getPositionFromUid(rags, uid) {
    let ret;
    rags.some((rag, index, list) => {
        if (rag.form10uid === uid) {
            ret = {
                list, index
            };
            return true;
        }
        if (rag.rags.length) {
            const result = getPositionFromUid(rag.rags, uid);
            if (result) {
                ret = result;
                return true;
            }
        }
        return false;
    });
    return ret;
}
const draggableOptions = {
    group: "a",
    animation: 150,
};
export default {
    provide: {
        draggableOptions
    },
    name: "NestedList",
    props: {
        value: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        rags: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            }
        },
        disabled() {
            return this.rags.length === 1;
        },
        draggableOptions() {
            return Object.assign({}, draggableOptions, {
                disabled: this.disabled
            });
        }
    },
    beforeMount() {
        const vue = new Vue();
        this.$options.provide.eventHub = vue;
        vue.$on('remove', (uid) => {
            const { list, index } = getPositionFromUid(this.value, uid);
            list.splice(index, 1);
        });
    },
    data() {
        return {

        };
    },
    components: { Rag }
};
</script>

<style scoped lang="less">
.draggable {
    min-height: 100px;
    &.empty{
        background-color: #f3f3f3;
    }

    padding: 10px;
}
</style>
