export class PasswordValidator{
  hello:string; 
  public validate(control) {
      let matched: Boolean = false;
      if(control.parent){
         matched  = ((control.parent.value.password == control.value)&&((control.value != '')));
      }      
      return matched ? null : {'passwordMatchValidator': {value: control.value}};
 }
}
