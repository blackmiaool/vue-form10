<template>
    <TypeWrapper :form="form">           
            <div slot="input" style="width:100%;">
                <el-input-number v-model="model"  :disabled="form.readonly">
            </el-input-number>
            </div>
    </TypeWrapper>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "NumberType",
    mixins: [Type]
};
</script>
