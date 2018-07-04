<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <div slot="input">
            <el-date-picker :disabled="form.readonly"
                v-model="model" type="datetime"
                :placeholder="form.placeholder" value-format="timestamp">
            </el-date-picker>
        </div>

    </TypeWrapper>
</template>

<script>
import FormatMixin from "../mixins/format";

export default {
    name: "TimestampType",
    mixins: [FormatMixin],
    form10: {
        format: { name: 'timestamp', format: /^\d{13}$/ },
    },
};
</script>
