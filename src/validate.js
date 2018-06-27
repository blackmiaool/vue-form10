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
export default function validate(value, schema) {
    const isValid = tv4.validate(value, schema);
    const error = tv4.error;
    let message;
    if (!isValid) {
        if (error.code === 302) {
            message = error302Handler(error, schema);
        }
    }
    if (message) {
        error.message = message;
    }
    return error;
}
