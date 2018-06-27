# vue-form10

> A Vue.js project

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
