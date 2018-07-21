<template>
    <div class="wrap" @click.stop="onClick">
        <component :is="'format'+plugin.form10.format.name" :sf-schema="sfSchema" :sf-model.sync="model" :parent="parent" :path="path" :options="options" :name="name" :margin="margin"></component>
    </div>
</template>

<script>
import tv4 from "tv4";
import isEqual from "lodash/isEqual";
import { pluginEmptyValues } from "../util";
import store from "../store";

export default {
    name: "AnyTypePreview",
    methods: {
        isEqual,
        onClick() {}
    },
    beforeCreate() {
        this.$store = store();
    },
    computed: {
        type() {
            return this.plugin.form10.format.types[0];
        },
        sfSchema() {
            const preview = this.plugin.form10.format.preview;
            if (preview && preview.schema) {
                return preview.schema;
            }
            return {
                type: this.type
            };
        },
        model: {
            set() {},
            get() {
                return pluginEmptyValues[this.type];
            }
        },
        path() {
            return ["model", "list"];
        }
    },
    components: {},
    beforeMount() {
        this.$options.components[`format${this.plugin.form10.format.name}`] = this.plugin;
    },
    props: ["plugin", "sf-model", "name", "parent", "is-last", "parent-path", "margin"],
    data() {
        return {
            options: {
                tv4
            }
        };
    }
};
</script>


<style scoped>
.wrap{
    pointer-events: none;
}
</style>
