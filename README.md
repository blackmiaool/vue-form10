# vue-form10

# Install
```bash
npm i -S vue-form10
```

# Usage
```html
<template>
  <div id="app">
    <Form10 :schema="schema" :plugins="form10plugins" v-model="model"/>
    <pre>{{JSON.stringify(model,false,4)}}
    </pre>
  </div>
</template>

<script>
import Form10 from 'vue-form10';
import form10plugins from 'vue-form10/libs/plugins';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';

Vue.use(ElementUI);

export default {
  name: 'app',
  data() {
    return {
      model:{

      },
      form10plugins,
      schema: {
        type: 'object',
        title: 'obj',
        properties: {
          str: {
            type: 'string',
            title: 'str',
          },
          obj: {
            type: 'object',
            title: 'obj',
            properties: {
              str: {
                type: 'string',
                title: 'str',
              },
            },
          },
        },
      },
    };
  },
  components: {
    Form10,
  },
};
</script>
```
## Props

### v-model
Form10's model

### options
Type:`Object`  
Required:`false`

#### options.inline
Type:`Boolean`  
Required:`false`  
If the label and the input are on the same line.

#### options.formProps
Type:`Object`  
Required:`false`  
Pass to form10's topmost `el-form` component.

#### options.inheritState
Type:`Object`  
Required:`false`  
Used to compose form10's vuex state. Form10 has its own vuex state, so its format plugins can't access its $parent's state. Pass `this.$store.state` to this option and the format plugins can access the state by `this.$store.state.inherit`.

#### options.typeDefaultFormat
Type:`Object`  
Required:`false`  
Default:`{
    object: "object",
    array: "array",
    number: "number",
    integer: "number",
    string: "string",
    boolean: "boolean",
    null: "null"
}`  
If a schema has `type` but doesn't have `format`, form10 uses `typeDefaultFormat[type]` to decide its format.


### schema
Type:`Object`  
Required:`true`

### plugins
Type:`Array`  
Required:`true`  

## Methods

### submit
`Function():Object`

Returns:
If has error: `{ error }`  
If not: `{ value }`


# Reference
[Json Schema Validation](http://json-schema.org/latest/json-schema-validation.html)





# Compared with angular-schema-form
* [ ]  required:["a","b"]
* [ ]  key: "address.street"  
* [x]  type: "text"  
* [x]  title: "Street"  
* [x]  notitle: false  
* [x]  description: "Street name"  
* [x]  validationMessage: "Oh noes, please write a proper address"  
* [x]  onChange: "valueChanged(form.key,modelValue)"  
* [ ]  (won't support) feedback: false(try to set :status-icon="true" on el-form)
* [x]  disableSuccessState: false  
* [x]  disableErrorState: false  
* [x]  placeholder: "Input..."  
* [ ]  (won't support) ngModelOptions: { ... }  
* [x]  readonly: true                                 
* [x]  htmlClass: "street foobar"  
* [ ]  (won't support) fieldHtmlClass: "street"  
* [ ]  (won't support) labelHtmlClass: "street"  
* [x]  copyValueTo: ["address.street"] (can't differentiate user input and model change though)
* [x]  condition: "person.age < 18"  
* [x]  destroyStrategy: "remove" 
