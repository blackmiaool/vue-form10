<template>
    <div class="hello">
        <div class="left">
            <div class="form-wrap" ref="formWrap">
                <div ng-controller="FormController">
                    <form name="myForm" sf-schema="schema" sf-model="model" sf-form="form" sf-options="options"></form>
                </div>
            </div>
        </div>
        <div class="right">
            <Form10 :sf-schema="schema" :sf-model.sync="model" :sf-form="form" :sf-options="options" />
        </div>
    </div>
</template>

<script>
import Form10 from "./Form10";

const angular = window.angular;
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
        function () {
            // sp.model = {};
            // sp.copy = function () {
            //     localStorage.setItem(
            //         "stable-model-save",
            //         JSON.stringify(sp.model)
            //     );
            // };
        }
    ]);
const schema = {
    type: "object",
    properties: {
        pic_url: {
            type: "string",
            title: "图片地址",
            format: "link"
        },
        color: {
            type: "string",
            title: "测试颜色",
            format: "color"
        },
        time: {
            type: "number",
            title: "测试时间戳",
            format: "timestamp"
        },
        json: {
            type: "string",
            title: "测试json",
            format: "json"
        },
        money: {
            type: "number",
            title: "测试money",
            format: "money"
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
const model = { obj: {} };
const form = ["*"];
export default {
    name: "HelloWorld",
    mounted() {
        angular.bootstrap(this.$refs.formWrap, ["main"]);
        const scope = angular.element(this.$refs.formWrap).scope();
        scope.schema = schema;
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
}
</style>
