import tv4 from "tv4";

function getSchameFromErrorAndSchema(error, schema) {
    function getObjFromPath(obj, path) {
        if (!path.length) {
            return obj;
        }
        if (path[0] === '') {
            return getObjFromPath(obj, path.slice(1));
        }
        return getObjFromPath(obj.properties[path[0]], path.slice(1));
    }
    return getObjFromPath(schema, error.dataPath.split("/")).properties[error.params.key];
}

function error302Handler(error, schema) {
    const title = getSchameFromErrorAndSchema(error, schema).title;
    return `没有填写字段: ${title}`;
}
export default async function validate(value, schema) {
    const { valid, errors } = await tv4.validateMultiple(value, schema);
    if (!valid) {
        errors.forEach((error) => {
            if (error.code === 302) {
                error.message = error302Handler(error, schema);
            }
        });
    }
    return errors;
}
