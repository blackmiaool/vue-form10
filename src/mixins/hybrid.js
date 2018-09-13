import difference from "lodash/difference";
import { getDefaultFromSchema, pluginEmptyValues } from "@/util";

export default {
    beforeMount() {
        if (!this.model || typeof this.model !== 'object' || Object.keys(this.model).length === 0) {
            this.model = getDefaultFromSchema(this.schema);
        }

        Object.keys(this.ownProperties).forEach((key) => {
            if (!Object.hasOwnProperty.call(this.model, key)) {
                const property = this.ownProperties[key];
                if (property.default !== undefined) {
                    this.$set(this.model, key, property.default);
                } else {
                    this.$set(this.model, key, pluginEmptyValues[property.type]);
                }
            }
        });
    },
    computed: {
        ownProperties() {
            let properties = this.$options.form10.format.properties || {};
            if (typeof properties === 'function') {
                properties = properties(this.schema);
            }
            return properties;
        },
        keys() {
            return difference(Object.keys(this.schema.properties || {}), Object.keys(this.ownProperties));
        }
    },
};
