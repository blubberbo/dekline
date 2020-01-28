import { Component, OnInit, Input } from '@angular/core';
import { SentenceService } from './sentence.service';
import { MaskedWord } from './models/masked-word.model';
import { ErrorService } from '../shared/error/error.service';
import { Sentence } from './models/sentence.model';
import { SentenceType } from '../shared/models/enums/sentence-type.enum';

@Component({
  selector: 'dekline-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.scss']
})
export class SentenceComponent implements OnInit {
  // an instance of the SentenceType enum to use in the html template
  _SentenceType = SentenceType;
  // an input to control which sentenceType the component is going to use
  @Input() sentenceType: number;
  // a flag to indicate the currentSentence is loading (i.e. the http request is being made)
  currentSentenceLoading = true;
  // a flag to indicate the onDeckSentence is loading
  private onDeckSentenceLoading = false;
  // an object for the current sentence
  protected currentSentence = new Sentence();
  // an object for the sentence that is on deck (used for quick loading when the user clicks "next")
  protected onDeckSentence = new Sentence();
  // a flag to keep track of whether there are any invalid inputs in the sentence (used in the template to disable "next")
  allInputsValid = false;
  // a flag to indicate a (any) definition is currently showing - used to check if they need to be closed
  protected definitionShowing = false;
  // answers clicked - this is used to indicate the user used the button to get the answer (i.e. did not enter it themselves)
  protected answersClicked = false;

  constructor(private _sentenceService: SentenceService, private _errorService: ErrorService) { }

  ngOnInit() {
    // when the component loads, get a sentence from the server and load it using the local method
    this.getSentence();
    // also, get a second sentence to keep "on deck" for instant loading when the user wants a new sentence
    this.getSentence(true);
  }

  // get a sentence from the server, if onDeck is true, load the sentence to the onDeckobject instead of the current Sentence
  protected getSentence(onDeck: boolean = false, sentenceType: number = this.sentenceType): void {
    // indicate that a current sentence is being loading unless we are loading an onDeck sentence - then do not change the value
    this.currentSentenceLoading = !onDeck ? true : this.currentSentenceLoading;
    // indicate that a onDeck sentence is being loading unless we are loading a current sentence - then do not change the value
    this.onDeckSentenceLoading = onDeck ? true : this.onDeckSentenceLoading;
    // make the http api call
    this._sentenceService.getSentence(sentenceType).subscribe(
      data => this.loadBookData(data, onDeck),
      error => {
        this._errorService.redirectToErrorPage(error.status, error.error.msg);
      }
    );
  }

  // process and load the book data into the component
  protected loadBookData(bookData: any, onDeck: boolean = false) {
    // first, ensure the bookData has content - as sometimes it does not when returned from the api endpoint
    if (bookData) {
      // if we are not loading the onDeckSentence (i.e. we're loading the currentSentence) - which is the default
      if (!onDeck) {
        // we want to process the sentence normally, and load it into the component
        // if a sentence has already loaded, skip this block, as a sentence will come but we want to prevent multiple clicks
        if (this.currentSentenceLoading) {
          // initialize the current sentence
          this.currentSentence = new Sentence();
          // extract the maskedSentence form the book data and load it into the component
          this.currentSentence.maskedSentence = bookData.maskedSentence;
          // extract the bookTitle from the book data and load it into the component
          this.currentSentence.bookTitle = bookData.bookTitle;
          // extract the maskedSentence from the book data and load it into the component
          this.currentSentence.wordsArray = this.parseSentence(this.currentSentence.maskedSentence);
          // indicate that the currentSentence has been loaded
          this.currentSentenceLoading = false;
        }
      } else {
        // else, we are loading the onDeckSentence
        // if a sentence has already loaded, skip this block, as a sentence will come but we want to prevent multiple clicks
        if (this.onDeckSentenceLoading) {
          // initialize the onDeckSentence
          this.onDeckSentence = new Sentence();
          // push the sentence information to the object without loading
          this.onDeckSentence.maskedSentence = bookData.maskedSentence;
          this.onDeckSentence.bookTitle = bookData.bookTitle;
          this.onDeckSentence.wordsArray = this.parseSentence(this.onDeckSentence.maskedSentence);
          // indicate that the onDeckSentence has been loaded
          this.onDeckSentenceLoading = false;
        } else {
          // else, a sentence is still loading, so keep the "Next" button enabled so the user can click it again
          this.allInputsValid = true;
        }
      }
    } else {
      // else, bookData was null, so we need to call for another sentence, passing whether it was on deck or not back to the method
      this.getSentence(onDeck);
    }
  }

  // parse the sentence into an array
  // returns an array of word objects
  protected parseSentence(maskedSentence: string): Array<MaskedWord> {
    // create a return variable
    const returnArray: Array<MaskedWord> = [];
    // create a temporary array to hold the masked words, splitting the maskedSentence by spaces
    const maskedWordsArray = maskedSentence.split(' ');
    // iterate over the masked words
    for (const maskedWord of maskedWordsArray) {
      // create a temp object for the masked word
      const temp_maskedWord = new MaskedWord();
      // determine if the masked word is actually masked (which means it includes the special '$$' syntax)
      if (maskedWord.indexOf('##') > -1) {
        // remove the '$$' blocks and split the word by ':' to get the two values
        const temp_maskedWordArray = maskedWord.replace(/##/g, '').split(':');
        // the first value is the masked value
        temp_maskedWord.maskedValue = temp_maskedWordArray[0];
        // the second value is the original word
        temp_maskedWord.originalValue = temp_maskedWordArray[1];
      } else {
        // else, the word was not masked, so just pass the original value to the temp object
        temp_maskedWord.originalValue = maskedWord;
      }
      // pass the temp object into the returnArray
      returnArray.push(temp_maskedWord);
    }
    // return the returnArray
    return returnArray;
  }

  // when a Word Input is blurred out of
  protected onWordInputBlur(wordIndex) {
    // if the word entered is valid (ie if it matches the original word)
    if (this.currentSentence.wordsArray[wordIndex].isValid()) {
      // show the correct checkmark animation using the check mark animation class
      this.currentSentence.wordsArray[wordIndex].shake = false;
    } else {
      // else, the input is not correct, so do the shake animation using the shake animation class
      // first, set the shake property to false (in the event it was set to true previously and has already shaken)
      this.currentSentence.wordsArray[wordIndex].shake = false;
      // after a 1 ms delay, set the shake property to true in order to initiate the shake animation
      setTimeout(x => { this.currentSentence.wordsArray[wordIndex].shake = true; }, 1 );
    }
  }

  // when a key is pressed inside the Word Input
  protected onWordInputKeyup() {
    // validate all the inputs in the sentence and pass the value to the local flag (this is to disable/enable the "next")
    this.allInputsValid = this.validateAllInputs();
  }

  // when the "Next" button is clicked
  onNextClick() {
    // check if the answers button was used to get the answers
    if (!this.answersClicked) {
      // the user did not click on the answers button, so they must have filled in the input(s) themself
      // log the sentence to the db, passing in the masked sentence value
      // Note: we need to do this before the currentSentence is overwritten
      this._sentenceService.logSubmission(this.currentSentence.maskedSentence);
    } else {
      // else, the user did use the answers button, so we need to reset the flag
      this.answersClicked = false;
    }
    // load the onDeckSentence to the currentSentence
    this.currentSentence = this.onDeckSentence;

    // change the local flag to indicate the inputs are not all valid (since we loaded a new sentence)
    this.allInputsValid = false;
    // get and load a new sentence to the onDeckSentence
    this.getSentence(true);
  }

  // when the "Answers" button in the UI is clicked"
  onAnswersClick() {
    // show the answers for all the inputs
    for (const maskedWord of this.currentSentence.wordsArray) {
      // if the input is not valid
      if (!maskedWord.isValid()) {
        maskedWord.inputValue = maskedWord.originalValue;
      }
    }
    // change the local flag to indicate that all the inputs are now valid (since we just auto-filled the answers)
    this.allInputsValid = true;
    // indicate the answers button was clicked via the local property
    this.answersClicked = true;
  }

  // returns whether or not all the inputs in the sentence are valid
  protected validateAllInputs(): boolean {
    // create a return variable
    let returnBoolean = true;
    // iterate over the words
    for (const word of this.currentSentence.wordsArray) {
      // if the word is not valid
      if (!word.isValid()) {
        // set the returnBoolean to false
        returnBoolean = false;
        // break out of the for loop, because we only need 1 false value
        break;
      }
    }
    return returnBoolean;
  }

  // get the definitions for a word (usually when a word is hovered over)
  protected getDefinitions(word: string, wordIndex: number) {
    this._sentenceService.getDefinitions(word).subscribe(
      data => {
        // so long as the data returned ok
        if (data.success) {
          // pass the definitions to the current sentnce
          this.currentSentence.wordsArray[wordIndex].definitions = data.definitions;
          // call the local method to show the definitions
          this.hideAllDefinitions();
          // show the definitions for the selected word
          this.currentSentence.wordsArray[wordIndex].showDefinitions = true;
          // swap the local flag to indicate a definition is being shown
          this.definitionShowing = true;
        } },
      error => {
        this._errorService.redirectToErrorPage(error.status, error.error.msg);
      }
    );
  }

  // a local method to hide all definitions
  protected hideAllDefinitions() {
    // if there is a definition showing
    if (this.definitionShowing) {
      // hide all the definitions by iterating over the currentSentence.wordsArray
      for (const word of this.currentSentence.wordsArray) {
        // hide the definitions
        word.showDefinitions = false;
      }
      // swap the local flag to indicate no definition is being show
      this.definitionShowing = false;
    }
  }

  // when a click is made anywhere outside of the definitions box
  onClickedOutsideDefinitionsBox(event: any) {
      // hide all the definitions
      this.hideAllDefinitions();
  }
}
