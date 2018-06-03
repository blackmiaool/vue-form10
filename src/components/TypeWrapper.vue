<template>
    <el-form-item :label="(hideTitle||form.notitle)?'':$t(form.title)"
        :style="{marginBottom:marginBottom}"
        :class="[form.htmlClass]" :error="errorMessage"
        ref="formItem">
        <div style="clear:both;">
            <slot name="input">
            </slot>
        </div>
        <span v-if="form.description" class="form10-description">
            {{form.description}}
        </span>
    </el-form-item>
</template>

<script>
import { FormItem } from 'element-ui';

export default {
    name: "TypeWrapper",
    mixins: [],
    mounted() {},
    props: { form: {}, options: {}, "hide-title": { type: Boolean } },
    computed: {
        marginBottom() {
            if (this.$parent.isLast) {
                return 0;
            }
            if (this.$parent.parent === "object" || this.$parent.parent === "array") {
                return "15px";
            }
            return "0";
        }
    },
    data() {
        return {
            errorMessage: ""
        };
    },
    components: {
        'el-form-item': FormItem
    }
};
</script>

<style>
.CodeMirror{
    height: 100%;
}
</style>
<style scoped>
.form10-description {
    line-height: 20px;
    font-size: 14px;
    vertical-align: baseline;
    color: #737373;
}
</style>
