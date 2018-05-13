<template>
    <el-form class="vue-form10">
        <AnyType :parent-path="rootPath" :key="uid"
            parent="root"
            :sf-form="form" :options="this.options"></AnyType>
    </el-form>
</template>

<script>
import { mapState } from "vuex";
import AnyType from "./AnyType";
import store from "../store";


export default {
    name: "Form10",
    store,
    mounted() {
        const schema = this.sfSchema;

        if (schema.type === "object") {
            this.compForm = schema;
        }
    },
    provide() {
        return { options: this.sfOptions };
    },
    computed: {
        options() {
            const options = {
                $rootParent: this.$parent
            };
            if (this.sfOptions) {
                Object.assign(options, this.sfOptions);
            }
            return options;
        },
        // model: {
        //     set(value) {
        //         this.$emit("update:sf-model", value);
        //     },
        //     get() {
        //         return this.sfModel;
        //     }
        // },
        form() {
            return this.compForm;
        },
        ...mapState(['model'])
    },
    watch: {
        model: {
            deep: true,
            handler(model) {
                console.log('emit', model);
                this.$emit('input', model);
            }
        },
        form: {
            deep: true,
            handler() {
                this.uid++;
            }
        }
    },
    props: ["sf-schema", "sf-model", "sf-form", "sf-options"],
    data() {
        return {
            rootPath: ['model'],
            uid: 0,
            componentId: "div",
            compForm: {}
        };
    },
    components: { AnyType }
};
</script>


<style scoped>

</style>
