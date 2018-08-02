import difference from "lodash/difference";

export default {
    beforeMount() {
        if (!this.model || typeof this.model !== 'object') {
            this.model = {};
        }
        this.keys.forEach((key) => {
            if (!Object.hasOwnProperty.call(this.model, key)) {
                this.$set(this.model, key, null);
            }
        });
    },
    computed: {
        keys() {
            let properties = this.$options.form10.format.properties || {};
            if (typeof properties === 'function') {
                properties = properties(this.schema);
            }
            return difference(Object.keys(this.schema.properties || {}), Object.keys(properties));
        }
    },
};
