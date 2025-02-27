const mask = (selector, options = {}) => {
    const { autoValidate = false } = options;

    function isValidInput(input) {
        const cleanValue = input.value.replace(/\D/g, '');
        let isValid = false;
        
        for (const item of maskList) {
            const maskDigits = item.code.replace(/[^\d#]/g, '').length;
            // Escape special characters and create pattern
            const maskPattern = item.code
                .replace(/[+]/g, '\\+')  // Escape +
                .replace(/[#]/g, '\\d')  // Replace # with \d
                .replace(/ /g, '\\s?');  // Make spaces optional
            const regex = new RegExp(`^${maskPattern}$`);
            
            if (cleanValue.length === maskDigits && 
                regex.test(input.value.replace(/[- )(]/g, ''))) {
                isValid = true;
                break;
            }
        }
        
        return {
            isValid,
            value: input.value,
            cleanedValue: cleanValue
        };
    }

    function setMask() {
        let matrix = '+###############';
        const cleanPhone = this.value.replace(/[\s#-)(]/g, '');

        maskList.forEach(item => {
            let code = item.code.replace(/[\s#]/g, '');
            if (cleanPhone.includes(code)) {
                matrix = item.code;
            }
        });

        let i = 0;
        const val = this.value.replace(/\D/g, '');

        this.value = matrix.replace(/(?!\+)./g, function(a) {
            return /[#\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
        });

        if (autoValidate) {
            const validation = isValidInput(this);
            this.classList.toggle('valid', validation.isValid);
            this.classList.toggle('invalid', !validation.isValid);
        }
    }

    const inputs = document.querySelectorAll(selector);

    inputs.forEach(input => {
        if (!input.value) input.value = '+';
        
        input.validate = function() {
            return isValidInput(this);
        };

        input.addEventListener('input', setMask);
        input.addEventListener('focus', setMask);
        input.addEventListener('blur', setMask);
    });

    return inputs;
};