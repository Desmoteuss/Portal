
const isEmpty = (string) => { 
    if (string.trim() === '') return true;
    else return false;
    };

const isEmail = (email) => { 
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};


exports.validateSignupDate = (data) => { 
    
    let errors = {};
    
    if(isEmpty(data.email)) {
      errors.email = ' cannot be empty'
    }
    else if (!isEmail(data.email)) { 
      error.email = " Provide valid email address "
    }
    
    if(isEmpty(data.password)) {
      errors.password = ' cannot be empty'
    }
    if(data.password === newUser.confirmPassword) errors.confirmPassword = ' Password must match'
    if(isEmpty(data.handle)) {
      errors.handle = ' cannot be empty'
    }
    


    return{
        errors,
        valid:Object.keys(errors).lenght === 0 ? true: false 
    }
}



exports.validateLoginDate = (data) =>{
let errors = {};
        
        
if ( isEmpty(data.email)) errors.email = ' cannot be empty';
if ( isEmpty(data.password)) errors.password = ' cannot be empty';
return{
    errors,
    valid:Object.keys(errors).lenght === 0 ? true: false 
}
}