<template>
    <div class="hello">

        <fieldset v-if="name">
            <legend >{{form.title}}</legend>
            <AnyType v-for="(item,key) in form.schema.properties"
             :options="options"
             :key="key"
             :name="key"
             :sf-form="item"
             :sf-model.sync="model[key]"/>
        </fieldset>
        <AnyType  v-if="!name"
            v-for="(item,key) in form.schema.properties"
             :options="options"
             :key="key"
             :name="key"
             :sf-form="item"
             :sf-model.sync="model[key]"/>
    </div>
</template>

<script>
import Type from "../mixins/type";

export default {
    name: "ObjectType",
    mixins: [Type],
    beforeCreate() {
        // eslint-disable-next-line
        this.$options.components.AnyType = require("./AnyType").default;
    },
    mounted() {
        console.log();
    },
    props: [],
    data() {
        return {};
    },
    components: { }
};
</script>


<style scoped>

</style>
