<template>
    <div class="hello">
        <div class="left" v-if="showForm10" :style="{padding:showForm10?'10px':''}">
            <label>schema</label>
            <el-select v-model="selectingExample" placeholder="select an example">
                <el-option v-for="example in examples" :key="example.name"
                    :label="example.name" :value="example.name">
                </el-option>
            </el-select>
            <Editor v-model="schema" :path="selectingPath"
                style="margin-bottom:30px;" :plugins="plugins"
            />
            <codemirror v-model="code" :options="cmOptions"
                style="height:50vh;"></codemirror>
            <pre class="err-msg" v-if="errMsg">{{errMsg}}</pre>
            <br>
            <label>model</label>
            <pre>{{JSON.stringify(model,false,4)}}</pre>
        </div>
        <div class="right" v-if="showForm10">
            <Form10 ref="form10" :sf-schema="schema" v-model="model"
                :sf-form="form" :sf-options="options"
                @select="onSelect" :plugins="plugins"
            />
            <el-button @click="submit">{{$t("Submit")}}</el-button>
        </div>

    </div>
</template>

<script>
import Vue from "vue";
import JSON5 from "json5";
import VueCodemirror from "vue-codemirror";
import { Select, Option, Button } from "element-ui";
import find from "lodash/find";
import VueI18n from "vue-i18n";
// eslint-disable-next-line
import "codemirror/mode/javascript/javascript.js";
import Form10 from "./Form10";
import Editor from "./Editor";
import TimestampFormat from "../plugins/TimestampFormat";
import SelectFormat from "../plugins/SelectFormat";
import ArrayType from "../plugins/ArrayType";
import BooleanType from "../plugins/BooleanType";
import NumberType from "../plugins/NumberType";
import ObjectType from "../plugins/ObjectType";
import StringType from "../plugins/StringType";
import i18n from "../i18n";

// eslint-disable-next-line
import "codemirror/lib/codemirror.css";

Vue.use(
    VueCodemirror /* {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */
);

Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Button.name, Button);

const storageKey = "vue-form10-json";
const code = localStorage.getItem(storageKey) || "";

const model = null;

Vue.use(VueI18n);
export default {
    name: "Home",
    i18n,
    computed: {
        showForm10: () => !window.angular
    },
    methods: {
        submit() {
            console.log(this.$refs.form10.submit());
        },
        onSelect(path) {
            this.selectingPath = path;
            console.log("onselect", path);
        },
        timeoutSetSchema(s) {
            clearTimeout(this.setSchemaTimeout);
            this.setSchemaTimeout = setTimeout(() => {
                this.schema = s;
                localStorage.setItem(storageKey, JSON5.stringify(s, false, 4));
            }, 500);
        }
    },
    beforeDestroy() {
        clearTimeout(this.setSchemaTimeout);
    },
    mounted() {
        function importAll(r) {
            return r.keys().map(key => ({
                value: r(key),
                name: key.match(/([^/\\]+)\.json5$/)[1]
            }));
        }

        const examples = importAll(
            require.context("../examples/", true, /\.json5$/)
        );
        this.examples = examples;

        if (!this.code) {
            this.selectingExample = this.examples[0].name;
        }
    },
    watch: {
        model: {
            handler() {},
            deep: true
        },
        code: {
            immediate: true,
            handler(codeText, preCode) {
                if (preCode) {
                    return;
                }
                let obj;

                try {
                    // if (
                    //     preCode && JSON5.stringify(JSON5.parse(`${codeText}`)) ===
                    //     JSON5.stringify(JSON5.parse(`${preCode}`))
                    // ) {
                    //     return;
                    // }

                    obj = JSON5.parse(codeText);
                    this.timeoutSetSchema(obj);
                    if (this.errMsg) {
                        this.errMsg = "";
                    }
                } catch (e) {
                    obj = null;
                    this.errMsg = e.message;
                }
            }
        },
        schema: {
            deep: true,
            handler(schema) {
                this.code = JSON5.stringify(schema, false, 4);
                this.model = null;
            }
        },
        selectingExample(val) {
            this.model = null;
            this.selectingPath = [];
            this.timeoutSetSchema(find(this.examples, { name: val }).value);
            this.code = JSON5.stringify(
                find(this.examples, { name: val }).value,
                false,
                4
            );
        }
    },
    data() {
        return {
            plugins: [
                TimestampFormat,
                SelectFormat,
                ArrayType,
                BooleanType,
                NumberType,
                ObjectType,
                StringType
            ],
            selectingPath: null,
            selectingExample: null,
            examples: [],
            setSchemaTimeout: 0,
            errMsg: "",
            code,
            cmOptions: {
                // codemirror options
                lineWrapping: true,
                tabSize: 4,
                mode: "text/javascript",
                lineNumbers: true,
                line: true
            },
            schema: null,
            model: JSON.parse(JSON.stringify(model)),
            form: null,
            options: {
                mode: "editor"
            }
        };
    },
    components: { Form10, Editor }
};
</script>

<style scoped lang="less">
.hello {
    display: flex;
    .left {
        flex: 1;
        box-sizing: border-box;
    }
    .right {
        flex: 1;
    }
}
.err-msg {
    background-color: red;
    padding: 5px 2px;
    color: white;
    font-size: 16px;
}
</style>
