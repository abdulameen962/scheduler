export const validEmailInput = input => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const result = trim(input).match(validRegex);
    // console.log(result);
    if (result) {
        return true;
    }

    return false;
}

const validEmail = input => {
    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
    const isValidEmail = emailRegex.test(input);

    return isValidEmail;
}
// ngrok http --domain=suited-touched-mammoth.ngrok-free.app 80

export const trim = name => {
    if (typeof name === "string") return name.trim()

    else if(Number.isInteger(name)) return (trim(name.toString()))
    return name;
};

export const getRandom = () => {
    const num = Math.floor(Math.random() * 10);

    return num;
}

export function truncateString(str, maxLength) {  
    let result;
    if (str.length>maxLength) {  
       result = str.substring(0, maxLength) + "...";
    } else {  
       result = str;  
    }  

    return result;
}  

// fixed format dd-mm-yyyy
function dateString2Date(dateString) {
    const dt = dateString.split(/\-|\s/);
    return new Date(dt.slice(0, 3).reverse().join('-') + ' ' + dt[3]);
  }
  
// multiple formats (e.g. yyyy/mm/dd (ymd) or mm-dd-yyyy (mdy) etc.)
export function tryParseDateFromString(dateStringCandidateValue, format = "ymd") {
    const candidate = (dateStringCandidateValue || ``)
      .split(/[ :\-\/]/g).map(Number).filter(v => !isNaN(v));
    const toDate = () => {
      format = [...format].reduce((acc, val, i) => ({ ...acc,  [val]: i }), {});
      const parts = 
        [candidate[format.y], candidate[format.m] - 1, candidate[format.d] ]
          .concat(candidate.length > 3 ? candidate.slice(3) : []);
      const checkDate = d => d.getDate && 
        ![d.getFullYear(), d.getMonth(), d.getDate()]
          .find( (v, i) => v !== parts[i] ) && d || undefined;
      
      return checkDate( new Date(Date.UTC(...parts)) );
    };
  
    return candidate.length < 3 ? undefined : toDate();
  }