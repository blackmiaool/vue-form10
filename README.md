# vue-form10

> A Vue.js project

* [ ]  key: "address.street"  
* [x]  type: "text"  
* [x]  title: "Street"  
* [x]  notitle: false  
* [x]  description: "Street name"  
* [ ]  validationMessage: "Oh noes, please write a proper address"  
* [x]  onChange: "valueChanged(form.key,modelValue)"  
* [ ]  feedback: false  
* [ ]  disableSuccessState: false  
* [ ]  disableErrorState: false  
* [x]  placeholder: "Input..."  
* [ ]  (won't support) ngModelOptions: { ... }  
* [x]  readonly: true                                 
* [x]  htmlClass: "street foobar"  
* [ ]  (won't support) fieldHtmlClass: "street"  
* [ ]  (won't support) labelHtmlClass: "street"  
* [x]  copyValueTo: ["address.street"] (can't differentiate user input and model change though)
* [x]  condition: "person.age < 18"  
* [x]  destroyStrategy: "remove" 
