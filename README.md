TextAutoCorrector is a npm package that safely cleans up text that has mispellings, improper capitalization, lexical illusions, among other things.
 
Originally forked from https://github.com/reZach/
Demo index.html
## How to use
```
import textautocorrector from './dist/index.js';

var sentence = "im so   borrreeedddd";
console.log(textautocorrector.clean(sentence)); // "I'm so bored."
```
---

## Features

##### Automatically add periods at the end of sentences
```
"I am a sentence" -> "I am a sentence."
```

##### Remove "safe" lexical illusions
_(Some words are grammatically correct if repeated twice, words that are not are removed if duplicated)_
```
"The the pig snorted." -> "The pig snorted."
```

##### Spellcheck words
// work in progress
```
"I was mad becuase I left home early." -> "I was mad because I left home early."
```

##### Capitalize words at the beginning of sentences
```
"I like to run. he runs faster than I." -> "I like to run. He runs faster than I."
```

##### Change SMS/shorthand to full words
```
"Meet me at home asap." -> "Meet me at home as soon as possible."
```

##### Shrink stretched words
// work in progress
```
"I'm so borreedddd." -> "I'm so bored." 
```

##### Combine separated words
// small database
```
"Yesterday and to day we flew kites." -> "Yesterday and today we flew kites."
```

##### Split up sentences if connected
// small database
```
"Writing C# code is fun.It is much better than Java." -> "Writing C# code is fun. It is much better than Java."
```

##### Fix intended ellipsis
_(Intended ellipsis are any two or more periods separated by any number of periods and/or spaces)_
```
"I was thinking yesterday..that I should go outside." -> "I was thinking yesterday... that I should go outside." 
```

##### Add spaces between comma/semicolon/colon-separated words
```
"She likes to eat,cook,clean and dance!" -> "She likes to eat, cook, clean and dance!"
```

##### Fix extra spaces in between words
```
"Wow  what an  extra long coat!" -> "Wow what an extra long coat!"
```

##### Fix duplicate punctuation
// work in progress
```
" what a daay. i must have had 1,,000 shots" -> "What a day. I must have had 1,000 shots."
```
---