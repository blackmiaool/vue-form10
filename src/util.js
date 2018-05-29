export const emptyValue = {};

export function getSchemaFromPath(schema, path) {
    console.log(schema, path);
}
export function getDefaultFromSchema(schema, root) {
    if (!schema) {
        return schema;
    }
    if (schema.default) {
        return schema.default;
    }

    if (schema.type === 'object') {
        const ret = {};
        Object.keys(schema.properties).forEach((key) => {
            const value = getDefaultFromSchema(schema.properties[key]);
            if (value !== emptyValue) {
                ret[key] = value;
            }
        });
        if (Object.keys(ret).length) {
            return ret;
        }
        return {};
    }
    if (root) {
        return undefined;
    }
    return emptyValue;
}

