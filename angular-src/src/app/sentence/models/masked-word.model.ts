import { Definitions } from './definitions.model';

export class MaskedWord {
    // the masked value
    maskedValue = '';
    // the original value (used to validate input)
    originalValue = '';
    // the value input by the user into the <input>
    inputValue = '';
    // a property that is used to shake the <input>
    shake = false;
    // an object housing all the definitions of the word
    definitions: Definitions = new Definitions();
    // a flag to determine whether or not to show the definitions
    showDefinitions = false;
    // returns the proper width (in px) for the input in the UI, aka the length of the maskedValue * 15
    public inputWidth(): number  { return this.maskedValue.length * 15; }
    // returns whether or not the input word is valid (i.e. exists and trimmed and to lower case matches the original word)
    public isValid(): boolean {
        return this.maskedValue.length === 0 || (this.maskedValue.length > 0 && this.inputValue.length > 0
        && this.inputValue.trim().toLowerCase() === this.originalValue.trim().toLowerCase());
    }
}
