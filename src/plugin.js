import TypeMixin from "./mixins/type";


export const a = 1;
export function makeFormat(Type) {
    if (Type.mixins) {
        if (Type.mixins.indexOf(TypeMixin) === -1) {
            Type.mixins.push(TypeMixin);
        }
    } else {
        Type.mixins = [TypeMixin];
    }
    if (!Type.form10) {
        Type.form10 = {};
    }
     return Type;
}
