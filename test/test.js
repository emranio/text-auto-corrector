const textautocorrector = require("../src/index.js");

test('Automatically add periods at the end of sentences', () => {
    expect(textautocorrector.clean('I am a sentence')).toBe('I am a sentence.');
});

test('Remove "safe" lexical illusions', () => {
    expect(textautocorrector.clean('The the pig snorted.')).toBe('The pig snorted.');
});

test('Spellcheck words', () => {
    expect(textautocorrector.clean('I was mad becuase I left home early.')).toBe('I was mad because I left home early.');
});

test('Capitalize words at the beginning of sentences', () => {
    expect(textautocorrector.clean('I like to run. he runs faster than I.')).toBe('I like to run. He runs faster than I.');
});

test('Change SMS/shorthand to full words', () => {
    expect(textautocorrector.clean('Meet me at home asap.')).toBe('Meet me at home as soon as possible.');
});

test('Shrink stretched words', () => {
    expect(textautocorrector.clean(`I'm so borreedddd.`)).toBe(`I'm so bored.`);
});

test('Combine separated words', () => {
    expect(textautocorrector.clean('Yesterday and to day we flew kites.')).toBe('Yesterday and today we flew kites.');
});

test('Split up sentences if connected', () => {
    expect(textautocorrector.clean('Writing C# code is fun.It is much better than Java.')).toBe('Writing C# code is fun. It is much better than Java.');
});

test('Add spaces between comma/semicolon/colon-separated words', () => {
    expect(textautocorrector.clean('She likes to eat,cook,clean and dance!')).toBe('She likes to eat, cook, clean and dance!');
});

test('Fix extra spaces in between words', () => {
    expect(textautocorrector.clean('Wow  what an  extra long coat!')).toBe('Wow what an extra long coat!');
});

test('Fix duplicate punctuation', () => {
    expect(textautocorrector.clean(' what a daay. i must have had 1,,000 shots')).toBe('What a day. I must have had 1,000 shots.');
});