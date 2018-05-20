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

export default {
    name: "TimestampType",
    form10: {
        format: { name: 'timestamp', format: /^\d{13}$/ },
    },
    components: {
        'el-date-picker': DatePicker
    }
};
</script>
