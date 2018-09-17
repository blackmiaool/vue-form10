import Vue from "vue";
import get from "lodash/get";

export const emptyValue = {};

export function rag2schema(rag, getFormat) {
    rag = JSON.parse(JSON.stringify(rag));
    function makeChild(parent, key) {
        if (!getFormat) {
            return;
        }
        const targetFormat = getFormat(parent);
        let child = targetFormat.form10.format[key];
        if (child) {
            if (typeof child === 'function') {
                child = child(parent);
            }
            parent[key] = child;
        }
    }
    if (rag.type === "array") {
        makeChild(rag, 'items');

        if (!rag.items) {
            let items;
            if (rag.rags.length > 1) {
                items = rag2schema({
                    type: "object",
                    rags: rag.rags
                });
            } else if (rag.rags.length === 1) {
                items = rag2schema(rag.rags[0]);
            }
            rag.items = items;
        }
    } else if (rag.type === "object") {
        makeChild(rag, 'properties');

        rag.properties = rag.properties || {};
        rag.required = [];
        rag.rags.forEach(child => {
            const key = child.form10key || child.form10uid;
            rag.properties[key] = rag2schema(child);
        });

        Object.keys(rag.properties).forEach(key => {
            if (rag.properties[key].required) {
                rag.required.push(key);
            }
        });
    }
    if (rag.type === rag.format) {
        delete rag.format;
    }
    if (rag.form && Object.keys(rag.form).length === 0) {
        delete rag.form;
    }
    delete rag.rags;
    delete rag.form10uid;
    delete rag.form10key;
    return rag;
}
export function strip(data, schema) {
    if (!schema) {
        return;
    }
    if (schema.autoRemove) {
        if (!data) {
            return undefined;
        }
        const json = JSON.stringify(data);
        if (json === "[]" || json === "{}") {
            return undefined;
        }
    }
    if (schema.type === "object" && schema.properties) {
        Object.keys(schema.properties).forEach(key => {
            const result = strip(data[key], schema.properties[key]);
            if (result === undefined) {
                Vue.delete(data, key);
            }
        });
    } else if (schema.type === "array" && schema.items) {
        data.forEach(item => strip(item, schema.items));
    }
    return data;
}
export function traverseSchema(schema, cb) {
    if (!schema) {
        return;
    }
    cb(schema);
    if (schema.type === "object") {
        traverseSchema(schema.properties, cb);
    } else if (schema.type === "array") {
        traverseSchema(schema.items, cb);
    }
}
export function getPluginFromSchemaAndPlugins(schema, plugins, typeDefaultFormat) {
    let targetPlugin;
    let format = schema.format;
    if (!format && typeDefaultFormat) {
        format = typeDefaultFormat[schema.type];
    }
    if (format) {
        targetPlugin = plugins.find(plugin => {
            const shouldUse = get(plugin, "form10.format.shouldUse");
            if (shouldUse && shouldUse(schema.form || {}, schema)) {
                return true;
            }
            return false;
        });
        if (!targetPlugin) {
            targetPlugin = plugins.find(plugin => {
                return get(plugin, "form10.format.name") === format;
            });
        }
    }

    return targetPlugin;
}
export function getDefaultFromSchema(schema, root = true) {
    if (!schema) {
        return schema;
    }
    if (schema.default !== undefined) {
        return schema.default;
    }
    if (schema.defaultJSON) {
        return JSON.parse(schema.defaultJSON);
    }

    if (schema.type === "object") {
        const ret = {};
        if (!schema.properties) {
            return {};
        }
        Object.keys(schema.properties).forEach(key => {
            const value = getDefaultFromSchema(schema.properties[key], false);
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

export function stdFormObj(name, schema, options = {}) {
    // The Object.assign used to be a angular.copy. Should work though.
    const f = options.global && options.global.formDefaults ? Object.assign({}, options.global.formDefaults) : {};

    if (!schema) {
        return f;
    }

    if (options.global && options.global.supressPropertyTitles === true) {
        f.title = schema.title;
    } else {
        f.title = schema.title || name;
    }
    f.schema = schema;
    return f;
}
export const pluginEmptyValues = {
    object: {},
    array: [],
    boolean: false,
    number: 0,
    string: "",
    integer: 0
};

export function assignDeep(target, ...args) {
    if (target == null) {
        // TypeError if undefined or null
        throw new TypeError("Cannot convert undefined or null to object");
    }

    const to = Object(target);

    args.forEach(nextSource => {
        if (nextSource != null) {
            Object.keys(nextSource).forEach(nextKey => {
                if (typeof to[nextKey] === "object" && to[nextKey] && typeof nextSource[nextKey] === "object" && nextSource[nextKey]) {
                    assignDeep(to[nextKey], nextSource[nextKey]);
                } else {
                    to[nextKey] = nextSource[nextKey];
                }
            });
        }
    });
    return to;
}

export function getFormSchema(plugin, schema) {
    let pluginSchema = plugin.form10.schema || plugin.form10.formSchema;
    if (pluginSchema) {
        if (typeof pluginSchema === "function") {
            pluginSchema = pluginSchema(schema);
        }
    }
    return pluginSchema;
}

/**
 * Remove some schema from condition
 * @param {object} schema
 * @param {any} data
 */

export function getSchemaForTv4(schema0, data0) {
    function getSchemaForTv4One(objSchema, data, root) {
        if (objSchema.type === "object") {
            if (!objSchema.properties) {
                return;
            }
            Object.keys(objSchema.properties).forEach((key) => {
                const schema = objSchema.properties[key];
                const condition = schema.condition;
                if (condition) {
                    // eslint-disable-next-line no-new-func
                    const result = new Function("model", "parentModel", `return ${condition};`)(root, data);
                    if (!result) {
                        delete objSchema.properties[key];
                        if (objSchema.required) {
                            const index = objSchema.required.indexOf(key);
                            if (index > -1) {
                                objSchema.required.splice(index, 1);
                            }
                        }
                    }
                }
                getSchemaForTv4One(schema, data[key], root);
            });
        } else if (objSchema.type === "array" && objSchema.items) {
            data.forEach((item) => {
                getSchemaForTv4One(objSchema.items, item, root);
            });
        }
    }
    schema0 = JSON.parse(JSON.stringify(schema0));
    getSchemaForTv4One(schema0, data0, data0);
    return schema0;
}
