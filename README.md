# vue-form10

# Install
```bash
npm i -S vue-form10
```

# Usage
```html
<template>
  <div id="app">
    <Form10 :schema="schema" :plugins="form10plugins" />
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



### Reference
[Json Schema Validation](http://json-schema.org/latest/json-schema-validation.html)





### Compared with angular-schema-form
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
