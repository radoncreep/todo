// Composing a functioniality in a hook which can be dropped into any component where needed
// we want to manage the state of a form input meaning its value and its validity
import { useState } from 'react';

export const useFormInputHook = () => {
    const [value, setValue] = useState('');
    const [validity, setValidity] = useState(false);

    const inputChangeHandler = event => {
        setValue(event.target.value);
        if (event.target.value.trim === '') {
            setValidity(false);
        } else {
            setValidity(true);
        };
    };

    return { value: value, onChange: inputChangeHandler, validity }
};