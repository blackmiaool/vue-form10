export default {
    computed: {
        titleMap() {
            let arr = [];
            if (this.form.titleMap) {
                const titleMap = this.form.titleMap;
                if (Array.isArray(titleMap)) {
                    arr = titleMap;
                } else if (typeof titleMap === "object") {
                    arr = Object.keys(titleMap).map(key => {
                        return { value: key, name: titleMap[key] };
                    });
                } else {
                    console.warn("invalid titleMap:", this.form.titleMap);
                }
            } else if (this.schema.enum) {
                arr = this.schema.enum.map(name => {
                    return { value: name, name };
                });
            }
            return arr;
        }
    }
}
;
export const editorSchema = {
    type: "object",
    properties: {
        titleMap: {
            type: "array",
            options: {
                inline: false
            },
            form: {
                draggable: true
            },
            items: {
                type: "object",
                form: {
                    layout: 'half',

                },
                properties: {
                    name: {
                        type: "string",
                        title: "name"
                    },
                    value: {
                        type: "string",
                        title: "value"
                    },
                }
            }
        }
    }
}
;
