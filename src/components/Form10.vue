<template>
    <el-form class="vue-form10">
        <AnyType :parent-path="rootPath" :key="uid"
            parent="root"
            :sf-form="form" :options="this.options"></AnyType>
    </el-form>
</template>

<script>
import Ajv from "ajv";
import { mapState } from "vuex";
import { Form } from 'element-ui';
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
        const ajv = new Ajv();
        this.options.ajv = ajv;
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
        form() {
            return this.compForm;
        },
        ...mapState(['model']),
    },
    watch: {
        model: {
            deep: true,
            handler(model) {
                // console.log(JSON.stringify(model, false, 4));
                this.$emit('input', model);
            }
        },
        form: {
            deep: true,
            handler() {
                this.uid++;
            }
        },
        value: {
            immediate: true,
            handler(value) {
                // console.log('sf', model);
                this.$store.commit('setModel', { value });
            }
        }
    },
    props: ["sf-schema", "value", "sf-form", "sf-options"],
    data() {
        return {
            rootPath: ['model'],
            uid: 0,
            componentId: "div",
            compForm: {}
        };
    },
    components: { AnyType,
    'el-form': Form }
};
</script>


<style scoped>

</style>
