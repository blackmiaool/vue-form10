<template>
    <div class="hello">
        <div class="left" v-if="showForm10" :style="{padding:showForm10?'10px':''}">
            <codemirror v-model="code" :options="cmOptions"
                style="height:50vh;"></codemirror>
            <pre class="err-msg" v-if="errMsg">{{errMsg}}</pre>
            <pre>{{JSON.stringify(model,false,4)}}</pre>
        </div>
        <div class="right" v-if="showForm10">
            <Form10 :sf-schema="schema" v-model="model"
                :sf-form="form" :sf-options="options"
            />
        </div>

    </div>
</template>

<script>
import Vue from "vue";
import JSON5 from "json5";
import VueCodemirror from "vue-codemirror";
// eslint-disable-next-line
import "codemirror/mode/javascript/javascript.js";
import Form10 from "./Form10";
import TimestampFormat from "../plugins/TimestampFormat";
import SelectFormat from "../plugins/SelectFormat";
import ArrayType from "../plugins/ArrayType";
import BooleanType from "../plugins/BooleanType";
import NumberType from "../plugins/NumberType";
import ObjectType from "../plugins/ObjectType";
import StringType from "../plugins/StringType";

// eslint-disable-next-line
import "codemirror/lib/codemirror.css";

Vue.use(
    VueCodemirror /* {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */
);
Form10.use(TimestampFormat);
Form10.use(SelectFormat);
Form10.use(ArrayType);
Form10.use(BooleanType);
Form10.use(NumberType);
Form10.use(ObjectType);
Form10.use(StringType);

const storageKey = "vue-form10-json";
const code = localStorage.getItem(storageKey) || "";
const schema = {
    type: "object",
    properties: {
        string: {
            type: "string",
            title: "字符串",
            maxLength: 5,
            default: "333",
            // minLength: 2,
            "x-schema-form": {
                disableSuccessState: true,
                // disableErrorState: true,
                placeholder: "string哦",
                validationMessage: {
                    maxLength:
                        '{{title}}"{{value}}"太长了,最长{{schema.maxLength}}个字',
                    minLength: "太短了"
                }
            }
        },
        array: {
            type: "array",
            title: "array1",
            items: {
                title: "item",
                type: "string",
                default: "b",
                "x-schema-form": {
                    htmlClass: "items"
                }
            }
        },
        array2: {
            type: "array",
            title: "array1",
            "x-schema-form": {
                startEmpty: false
            },
            items: {
                type: "object",
                properties: {
                    a: {
                        title: "itema",
                        type: "string",
                        default: "1"
                    },
                    b: {
                        title: "itemb",
                        type: "string"
                        // default: "2"
                    }
                }
            }
        },
        readonly: {
            type: "string",
            title: "字符串",
            description: "readonly",
            "x-schema-form": {
                readonly: true
            }
        },
        boolean: {
            type: "boolean",
            title: "测试boolean",
            "x-schema-form": {
                // readonly: true,
                destroyStrategy: "empty",
                condition: "model.number>10"
            }
        },
        number: {
            type: "number",
            title: "测试number",
            maximum: 3
            // "x-schema-form": {
            //     onChange: modelValue =>
            //         console.log("number change", modelValue),
            //     copyValueTo: ["obj.b"]
            // }
        },
        enum: {
            type: "string",
            title: "测试enum",
            // enum: ["a", "b", "c"],
            "x-schema-form": {
                // type: "select",
                titleMap: [
                    { value: "Andersson", name: "Andersson" },
                    { value: "Johansson", name: "Johansson" },
                    { value: "1112223334445", name: "The right one" }
                ],
                placeholder: "enum哦"
            }
        },
        time: {
            type: "number",
            title: "测试时间戳",
            format: "timestamp"
        },
        money: {
            type: "number",
            title: "测试money"
            // format: "money"
        },
        obj: {
            type: "object",
            title: "obj",
            properties: {
                a: {
                    type: "string"
                },
                b: {
                    type: "number"
                }
            }
        }
    }
};

const model = {
    array: ["a", "b"]
};
export default {
    name: "HelloWorld",
    computed: {
        showForm10: () => !window.angular
    },
    methods: {
        a(num) {
            console.log("num change", num);
        },
        timeoutSetSchema(s) {
            clearTimeout(this.setSchemaTimeout);
            this.setSchemaTimeout = setTimeout(() => {
                this.schema = s;
            }, 500);
        }
    },
    beforeDestroy() {
        clearTimeout(this.setSchemaTimeout);
    },
    watch: {
        model: {
            handler(val) {
                console.log(JSON5.stringify(val, false, 4));
            },
            deep: true
        },
        code: {
            immediate: true,
            handler(codeText) {
                let obj;
                try {
                    obj = JSON5.parse(codeText);
                    localStorage.setItem(storageKey, codeText);

                    this.timeoutSetSchema(obj);
                    this.errMsg = '';
                } catch (e) {
                    console.log(e.message);
                    obj = null;
                    this.errMsg = e.message;
                }
            }
        }
    },
    data() {
        return {
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
            schema,
            model: JSON.parse(JSON.stringify(model)),
            form: null,
            options: {}
        };
    },
    components: { Form10 }
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
.err-msg{
    background-color:red;
    padding:5px 2px;
    color:white;
    font-size:16px;
}
</style>
