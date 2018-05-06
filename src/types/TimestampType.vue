<template>
    <TypeWrapper :form="form"  ref="typeWrapper">
        <div slot="input">
            <el-date-picker :disabled="form.readonly"
                v-model="time" type="datetime"
                :placeholder="form.placeholder">
            </el-date-picker>
        </div>

    </TypeWrapper>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "TimestampType",
    computed: {
        time: {
            set(value) {
                if (!value) {
                    return;
                }
                this.model = value.getTime();
            },
            get() {
                return new Date(this.model);
            }
        }
    },
    mixins: [Type]
};
</script>
