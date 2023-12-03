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
