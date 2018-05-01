<template>
    <div class="hello">
        <div class="left">
            <div class="form-wrap" ref="formWrap">
                <div ng-controller="FormController">
                    <form name="myForm" sf-schema="schema" sf-model="model"
                        sf-form="form" sf-options="options"></form>
                </div>
            </div>
        </div>
        <div class="right">
            <Form10 :sf-schema="schema" :sf-model.sync="model"
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
            "x-schema-form": {
                placeholder: "string哦"
            }
        },
        array: {
            type: "array",
            title: "array1",
            items: {
                title: "item",
                type: "string"
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
                readonly: true,
                condition: "model.number>10"
            }
        },
        number: {
            type: "number",
            title: "测试number"
        },
        enum: {
            type: "string",
            title: "测试enum",
            enum: ["a", "b", "c"],
            "x-schema-form": {
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
    obj: {},
    array: ["a", "b"]
};
const form = ["*"];
export default {
    name: "HelloWorld",
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
            msg: "Welcome to Your Vue.js App",
            schema,
            model: JSON.parse(JSON.stringify(model)),
            form: null,
            options: {}
        };
    },
    components: { Form10 }
};
</script>

<style scoped>
.left {
    width: 50%;
    float: left;
    padding: 10px;
}
.right {
    width: 50%;
    float: left;
    padding: 10px;
}
</style>
