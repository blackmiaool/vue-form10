import FormatMixin from "./mixins/format";


export const a = 1;
export function makeFormat(Type) {
    if (Type.mixins) {
        if (Type.mixins.indexOf(FormatMixin) === -1) {
            Type.mixins.push(FormatMixin);
        }
    } else {
        Type.mixins = [FormatMixin];
    }
    if (!Type.form10) {
        Type.form10 = {};
    }
     return Type;
}
