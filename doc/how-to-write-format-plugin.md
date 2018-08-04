# How to write format plugin


A standard format is like:
```html
<template>
    <TypeWrapper v-bind="typeWrapperProps" hide-title ref="typeWrapper">
        <template slot="input">
            <el-switch v-model="model" active-color="#13ce66" inactive-color="#aaaaaa" :active-text="form.notitle?'':$t(form.title)" :disabled="schema.readOnly">
            </el-switch>
        </template>
    </TypeWrapper>
</template>

<script>
import { FormatMixin } from "vue-form10";

export default {
    name: "boolean-default",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: 'boolean',
            types: ['boolean'],
        },
    },
    beforeMount() {
        if (!this.model || typeof this.model !== 'boolean') {
            this.model = false;
        }
    },
};
</script>
```

## Template
```html
<template>
    <TypeWrapper v-bind="typeWrapperProps" ref="typeWrapper">
        <template slot="input">            
            <!-- your code -->
        </template>
    </TypeWrapper>
</template>
```
The `TypeWrapper` and `template[slot="input"]` are always required for a format. Just write like this unless you have very specific needs.

## Script
```html
<script>
import { FormatMixin } from "vue-form10";

export default {
    name: "boolean-default",
    mixins: [FormatMixin],
    form10: {
        format: {
            name: 'boolean',
            types: ['boolean'],
        },
    },
    beforeMount() {
        if (!this.model || typeof this.model !== 'boolean') {
            this.model = false;
        }
    },
};
</script>
```
A format plugin is a standard vue component with `$options.format.form10` and it should have a mixin `FormatMixin` imported from `vue-form10`;

### form10

The `form10` property is a place to put your vue-form10 related config.

#### form10.format
Type: `Object`  
Required: `true`

Format related config
##### form10.format.name
Type: `String`  
Required: `true`

Format's unique name. Schema's `format` value should use this value to indicate the format it uses.
##### form10.format.types
Type: `Array[String]`  
Required: `true`

Format's available types. For example, you decide to write a timestamp format, and write it as a number type format. Afterwards the back-end developer request you to make the `timestamp` property be a string to fit his/her own logic.  But you don't want to make this change permanet. So write `form10.format.types=["number","string"]` to meet the requirement.

##### form10.format.title
Type: `String`  
Required: `false`  
default: `form10.format.name`

Shown as title in the editor mode.

##### form10.format.format
Type: `RegExp|Function:String`  
Required: `false`

Validate the data of the format. If it's a function, it will receive the data of the format as the only parameter. It returns the error that you find out in the data, or returns undefined if nothing wrong with the data.

##### form10.format.expand
Type: `Boolean`  
Required: `false`

If the type of the component is `Object` or `Array`, the component will automatically expand itself to use the full width of its parent. Otherwise, setting this flag is needed to expand its width.

##### form10.format.sealed
Type: `Boolean`  
Required: `false`

In the form editor(NestedList):

If the type of the rag is `Object` or `Array`, it has a area(drag area) to arrange its descendent rags by default. If you don't want the area, set this flag to `false`.

##### form10.preview
Type: `Object`  
Required: `false`

Form editor related things.

##### form10.preview.schema
Type: `Object`  
Required: `false`

A schema to render the components in the `FormatList`. A better preview schema should imply the function of the format.

#### form.defaultSchema
Type: `Object`
Required: `false`

A schema to generate component's default schema.

#### form.formSchema
Type: `Object|Function`  
Required: `false`

A to generate the rag editor's `schema.form`.  

`Object`:  
`schema.form`'s schema  

`Function`:  
Generate the schema above with its current schema as argument.

### FormatMixin

Provides many environment variables and utility functions to help you develop a format.

### FormatMixin's environment variables:
#### schema
Type:`Object`

#### form
Type:`Object`

schema.form
#### model
Type: Follows schema.type

Format's value. Format can modify this value directly. 

