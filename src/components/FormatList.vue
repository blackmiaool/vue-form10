<template>
    <el-form>
        <div v-for="(format,i) in formats" :key="i">
            <AnyTypePreview :plugin="format" />
        </div>
    </el-form>
</template>

<script>
import Form10 from "./Form10";
import AnyTypePreview from "./AnyTypePreview";

export default {
    name: "FormatList",
    computed: {
        formats() {
            return this.plugins.filter(plugin => {
                return plugin.form10 && plugin.form10.format;
            });
        }
    },
    methods: {},
    mounted() {},
    props: ["plugins"],
    components: {
        Form10,
        AnyTypePreview
    }
};
</script>
