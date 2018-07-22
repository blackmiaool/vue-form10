<template>
    <div class="wrap" style="height:100%;">
        <el-row :gutter="20" style="height:100%;">
            <el-col :span="8" style="height:100%;">
                <div style="height:100%;overflow:auto;">
                    <FormatList :plugins="plugins" />
                </div>

            </el-col>
            <el-col :span="8">
                <div style="height:100%;overflow:auto;">
                    <header>Edit Area (Only one is allowed in the root path)</header>
                    <NestedList v-model="rags" />
                </div>
            </el-col>
            <!-- <el-col :span="8">
                <label>schema</label>
                <el-select v-model="selectingExample" placeholder="select an example">
                    <el-option v-for="example in examples" :key="example.name" :label="example.name" :value="example.name">
                    </el-option>
                </el-select>
                <Editor v-model="schema" :path="selectingPath" style="margin-bottom:30px;" :plugins="plugins" />
                <codemirror v-model="code" :options="cmOptions" style="height:50vh;"></codemirror>
                <pre class="err-msg" v-if="errMsg">{{errMsg}}</pre>
                <br>
                <label>model</label>
                <pre>{{JSON.stringify(model,false,4)}}</pre>
            </el-col> -->
            <el-col :span="8" style="height:100%;">
                <div style="height:100%;overflow:auto;">
                    <header>Preview Area</header>
                    <Form10 ref="form10" :sf-schema="schema"
                        v-model="model"
                        :sf-options="options"
                        @select="onSelect" :plugins="plugins"
                    />
                    <el-button @click="submit">{{$t("Submit")}}</el-button>
                    <codemirror :value="modelCode" :options="cmOptions"/>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Vue from "vue";
import JSON5 from "json5";
import VueCodemirror from "vue-codemirror";
import ElementUI from "element-ui";
import VueI18n from "vue-i18n";
import "element-ui/lib/theme-chalk/index.css";

// eslint-disable-next-line
import "codemirror/mode/javascript/javascript.js";
import Form10 from "./Form10";
import Editor from "./Editor";
import i18n from "../i18n";
import FormatList from "./FormatList";
import NestedList, { rag2schema } from "./NestedList";
// eslint-disable-next-line
import "codemirror/lib/codemirror.css";

Vue.use(VueCodemirror, {
    options: {

    }
} /* {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */);
Vue.use(ElementUI);

const storageKey = "vue-form10-json";
const code = localStorage.getItem(storageKey) || "";

const model = null;

Vue.use(VueI18n);

const localRequire = require.context("../plugins", true, /\.vue$/);

function getPluginsFromContext(context) {
    return context
        .keys()
        .map(context)
        .map(a => a.default);
}
const plugins = getPluginsFromContext(localRequire);


export default {
    name: "Home",
    i18n,
    computed: {
        options() {
            const ret = {};
            if (this.editorMode) {
                ret.mode = "editor";
            } else {
                ret.mode = "normal";
            }
            return ret;
        },
        schema() {
            if (this.rags.length !== 1) {
                return null;
            }
            const ret = this.rags[0];
            return rag2schema(ret);
        },
        modelCode() {
            return JSON5.stringify(this.model, false, 4);
        }
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

        const examples = importAll(require.context("../examples/", true, /\.json5$/));
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
        schema: {
            deep: true,
            handler(schema) {
                this.code = JSON5.stringify(schema, false, 4);
                this.model = null;
            }
        },
        selectingExample() {
            // this.model = null;
            // this.selectingPath = [];
            // this.timeoutSetSchema(find(this.examples, { name: val }).value);
            // this.code = JSON5.stringify(find(this.examples, { name: val }).value, false, 4);
        }
    },
    data() {
        return {
            rags: [],
            plugins,
            selectingPath: null,
            selectingExample: null,
            examples: [],
            setSchemaTimeout: 0,
            errMsg: "",
            code,
            JSON5,
            cmOptions: {
                readOnly: true,
                // codemirror options
                lineWrapping: true,
                tabSize: 4,
                mode: "text/javascript",
                lineNumbers: true,
                line: true
            },
            // schema: null,
            model: JSON.parse(JSON.stringify(model)),
            form: null,
            editorMode: false,
        };
    },
    components: { Form10, Editor, FormatList, NestedList }
};
</script>

<style scoped lang="less">
.wrap {
    padding: 20px;
    box-sizing: border-box;
}
.err-msg {
    background-color: red;
    padding: 5px 2px;
    color: white;
    font-size: 16px;
}
</style>
