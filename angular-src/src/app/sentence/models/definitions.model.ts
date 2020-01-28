import { Noun } from './noun.model';
import { Other } from './other.model';
import { Adjective } from './adjective.model';
import { Verb } from './verb.model';
import { Adverb } from './adverb.model';

export class Definitions {
  nouns: Array<Noun> = [];
  verbs: Array<Verb> = [];
  adjectives: Array<Adjective> = [];
  adverbs: Array<Adverb> = [];
  others: Array<Other> = [];
}
