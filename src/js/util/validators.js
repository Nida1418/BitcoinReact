import validator from 'validator';

const generateResponse = (result = true, message = '') => {
    return {result: result, message: message};
}

export const requiredValidator = (value) => {
    if (typeof value === 'undefined' || value === null || !value.toString().trim().length) {        
        return generateResponse(false, 'Value is required for this field.');
    }
    return generateResponse(true);
};

export const integerValidator = (value) => {
    if (value && !validator.isInt(value)) {
        return generateResponse(false, 'Not a valid integer.');
    }
    return generateResponse(true);
};

export const numberValidator = (value) => {
    if (value && isNaN(value) || value < 0) {
        return generateResponse(false, 'Not a valid amount.');
    }
    return generateResponse(true);
};

export const emailValidator = (value) => {
    if (!validator.isEmail(value)) {
        return generateResponse(false, 'Not a valid email.');
    }
    return generateResponse(true);
};

export const bitcoinAddressValidator = (value) => {    
    if (!value || !value.match('^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$')) {
        return generateResponse(false, 'Not a valid wallet address.');
    }
    return generateResponse(true);
};

export const phoneValidator = (value) => {
    if (!validator.isMobilePhone(value, "en-AU")) {
        return generateResponse(false, 'Not a valid Mobile Phone Number.');
    }
    return generateResponse(true);
};

export const amountAudValidator = (value) => {
    if (2500 < value) {
        return generateResponse(false, 'Maximum order is $2,500');
    }
    return generateResponse(true);
};


export const amountAudMinValidator = (value) => {
    if (50 > value) {
        return generateResponse(false, 'Minimum order is $50');
    }
    return generateResponse(true);
};

export const checkedValidator = (value) => {        
    if (value === true) {
        return generateResponse(true);
    }
    return generateResponse(false, 'Checkbox must be selected');
}