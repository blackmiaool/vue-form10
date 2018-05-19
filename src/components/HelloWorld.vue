<template>
    <div class="hello">
        <div class="left" v-if="!showForm10">
            <div class="form-wrap" ref="formWrap">
                <div ng-controller="FormController">
                    <form name="myForm" sf-schema="schema" sf-model="model"
                        sf-form="form" sf-options="options"></form>
                </div>
            </div>
        </div>
        <div class="left" v-if="showForm10" :style="{padding:showForm10?'10px':''}">
            <iframe src="/index2.html" style="width:100%;border:none;height:100%;"
            />
        </div>
        <div class="right" v-if="showForm10">
            <Form10 :sf-schema="schema" v-model="model"
                :sf-form="form" :sf-options="options"
            />
        </div>

    </div>
</template>

<script>
import Form10 from "./Form10";

const angular = window.angular;
if (angular) {
    angular
        .module("main", ["schemaForm"].concat(window.schemaFormTypesArr))
        .config([
            "$sceProvider",
            $sceProvider => {
                $sceProvider.enabled(false);
            }
        ])
        .controller("FormController", [
            "$scope",
            function() {
                // sp.model = {};
                // sp.copy = function () {
                //     localStorage.setItem(
                //         "stable-model-save",
                //         JSON.stringify(sp.model)
                //     );
                // };
            }
        ]);
}

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
                disableErrorState: true,
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
                        type: "string",
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
            maximum: 3,
            "x-schema-form": {
                onChange: modelValue =>
                    console.log("number change", modelValue),
                copyValueTo: ["obj.b"]
            }
        },
        enum: {
            type: "string",
            title: "测试enum",
            // enum: ["a", "b", "c"],
            "x-schema-form": {
                type: "select",
                titleMap: [
                    { value: "Andersson", name: "Andersson" },
                    { value: "Johansson", name: "Johansson" },
                    { value: "other", name: "Something else..." }
                ],
                placeholder: "enum哦"
            }
        },
        time: {
            type: "number",
            title: "测试时间戳"
            // format: "timestamp"
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

// schema = {
//     type: "object",
//     properties: {
//         obj: {
//             type: "object",
//             title: "obj",
//             properties: {
//                 a: {
//                     type: "string"
//                 },
//                 b: {
//                     type: "number"
//                 }
//             }
//         }
//     }
// };
const model = {
    array: ["a", "b"]
};
const form = ["*"];
export default {
    name: "HelloWorld",
    computed: {
        showForm10: () => !window.angular
    },
    methods: {
        a(num) {
            console.log("num change", num);
        }
    },
    mounted() {
        if (window.angular) {
            angular.bootstrap(this.$refs.formWrap, ["main"]);
            const scope = angular.element(this.$refs.formWrap).scope();
            scope.schema = JSON.parse(JSON.stringify(schema));
            scope.form = form;
            scope.model = JSON.parse(JSON.stringify(model));
            scope.$digest();
            scope.$watch(
                "model",
                value => {
                    if (value) {
                        // this.floor.setData(value);
                    }
                },
                true
            );
            scope.options = {
                showArrayTools: false
            };
            console.log = function() {

            };
        }
    },
    watch: {
        model: {
            handler(val) {
                console.log(JSON.stringify(val, false, 4));
            },
            deep: true
        }
    },
    data() {
        return {
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
    height: 2000px;
    display: flex;
    .left {
        flex: 1;
        // padding:10px;
        box-sizing: border-box;
    }
    .right {
        flex: 1;
    }
}
</style>
