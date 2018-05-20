<template>
    <TypeWrapper :form="form"  ref="typeWrapper">
        <div slot="input">
            <el-date-picker :disabled="form.readonly"
                v-model="model" type="datetime"
                :placeholder="form.placeholder" value-format="timestamp">
            </el-date-picker>
        </div>

    </TypeWrapper>
</template>

<script>
import { DatePicker } from 'element-ui';
import Type from "../mixins/type";

export default {
    name: "TimestampType",
    beforeCreate() {
        this.$parent.options.ajv.addFormat('timestamp', /^\d{13}$/);
    },
    mixins: [Type],
    components: {
        'el-date-picker': DatePicker
    }
};
</script>
