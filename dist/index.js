// src/datasets/offlineExactMatchDataSet.js
var offlineExactMatchDataSet_default = [
  // A
  "awesome",
  // B
  // C
  // D
  // E
  "everything",
  // F
  // G
  // H
  "herself",
  "himself",
  // I
  // J
  // K
  // L
  // M
  // N
  "nowhere",
  // O
  // P
  // Q
  // R
  // S
  // T
  "today",
  // U
  // V
  // W
  // X
  // Y
  "yourself"
  // Z
];

// src/datasets/shortHandTextDataSet.js
var shortHandTextDataSet_default = {
  // #s
  "2night": "tonight",
  "2nite": "tonight",
  // A
  "asap": "as soon as possible",
  "asl": "American Sign Language",
  // B
  "bc": "because",
  "bf": "boyfriend",
  "btw": "by the way",
  // C
  "cuz": "because",
  // D
  // E
  "eg": "example",
  "els": "else",
  // F
  "f": "female",
  "ftw": "for the win",
  "fyi": "for your information",
  // G
  "gf": "girlfriend",
  "gotta": "got to",
  "gr8": "great",
  // H
  "hada": "had a",
  "hmu": "hit me up",
  "hr": "hour",
  "hrs": "hours",
  // I
  "idk": "I don't know",
  "im": "I'm",
  // J
  "jude": "Jude",
  // how to expand this to all proper nouns??
  // K
  "kinda": "kind of",
  // L
  // M
  "m": "male",
  "msg": "message",
  // N
  "nite": "night",
  "na": "N/A",
  "n/a": "N/A",
  // O
  "omg": "oh my gosh",
  // P
  "pls": "please",
  "plz": "please",
  "ppl": "people",
  // Q
  // R
  // S
  // T
  "tbh": "to be honest",
  "tho": "though",
  "thru": "through",
  "tryna": "trying to",
  // U
  "u": "you",
  // V
  // W
  "w": "with",
  "wanna": "want to",
  "whaat": "what",
  // spellchecker library thinks this is a word
  "whaaat": "what",
  // spellchecker library thinks this is a word
  "wk": "week",
  "wks": "weeks",
  "wtf": "what the fuck",
  "wth": "what the heck",
  "wya": "where are you at",
  // X
  // Y
  "yknow": "you know"
  // Z
};

// src/index.js
var canSpellcheck = true;
var spellchecker = null;
canSpellcheck = false;
var src_default = new TextAutoCorrector();
function TextAutoCorrector() {
  const preProcessMap = new TextAutoCorrector_PreProcess();
  const shortHandTextMap = new TextAutoCorrector_ShortHandText();
  const offlineExactMatchMap = new TextAutoCorrector_offlineExactMatch();
  const numberMap = new TextAutoCorrector_Numbers();
  return {
    clean: function(string) {
      if (string.length === 0) {
        return "";
      }
      string = string.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
      string = preProcessMap.fixPeriodAndEllipsis(string);
      string = preProcessMap.fixSpaceAfterCharacter(string);
      const words = string.split(" ");
      let newWords = words.filter((w) => w.length !== 0);
      newWords = shortHandTextMap.fixStretching(newWords);
      newWords = shortHandTextMap.fixShorthand(newWords);
      newWords = offlineExactMatchMap.fixSeparated(newWords);
      let endingPunctuation = [];
      for (let i = 0; i < newWords.length; i++) {
        if (newWords[i].indexOf(".") >= 0) {
          endingPunctuation.push(".");
        } else if (newWords[i].indexOf("!") >= 0) {
          endingPunctuation.push("!");
        } else if (newWords[i].indexOf("?") >= 0) {
          endingPunctuation.push("?");
        } else {
          endingPunctuation.push("");
        }
      }
      const duplicates = ["the", "a", "an", "and", "but", "or", "nor", "for", "so", "yet"];
      let corrections = [];
      let endingPunctuationIndex = false;
      let lastCharacter = "";
      let spcheckThisWord = "";
      let preSpellcheck = "";
      let preSpellcheckEndingPunct = "";
      for (let i = 0; i < newWords.length; i++) {
        if (i > 0 && newWords[i] === newWords[i - 1].trim().toLowerCase() && duplicates.indexOf(newWords[i].toLowerCase()) >= 0) {
          newWords.splice(i, 1);
          i--;
          continue;
        }
        preSpellcheck = newWords[i].match(/[\W]+$/g);
        if (preSpellcheck !== null) {
          spcheckThisWord = newWords[i].replace(/[\W]+$/g, "");
        } else {
          spcheckThisWord = newWords[i];
        }
        if (canSpellcheck && spellchecker.isMisspelled(spcheckThisWord)) {
          corrections = spellchecker.getCorrectionsForMisspelling(spcheckThisWord);
          if (corrections.length > 0) {
            newWords[i] = corrections[0];
            corrections = [];
            if (preSpellcheck !== null) {
              newWords[i] = newWords[i] + preSpellcheck[0];
            }
          }
        }
        if (i > 0) {
          endingPunctuationIndex = endingPunctuation[i - 1] !== "";
        }
        if (i === 0 || endingPunctuationIndex) {
          newWords[i] = newWords[i][0].toUpperCase() + newWords[i].substring(1);
        }
        if (i !== 0) {
          newWords[i] = " " + newWords[i];
        }
      }
      const lastWord = newWords.length - 1;
      lastCharacter = newWords[lastWord][newWords[lastWord].length - 1];
      if (lastCharacter !== "." && lastCharacter !== "!" && lastCharacter !== "?") {
        newWords[lastWord] = newWords[lastWord] + ".";
      }
      return newWords.join("");
    }
  };
}
function TextAutoCorrector_PreProcess() {
  const validCharsToFix = [",", ";", ":", "%"];
  const fixer = function(input, charToFix) {
    let regex = new RegExp("^[ \\" + charToFix + ".]+", "g");
    input = input.replace(regex, "");
    regex = new RegExp("\\b([ \\" + charToFix + "]*\\" + charToFix + "[ \\" + charToFix + "]*)(\\b|$)", "g");
    const badMatches = input.match(regex);
    let badMatchesIndex = 0;
    let tempSearch = "";
    if (badMatches !== null) {
      for (let i = 0; i < badMatches.length; i++) {
        badMatchesIndex = input.indexOf(badMatches[i], badMatchesIndex);
        tempSearch = input.substring(badMatchesIndex);
        if (badMatchesIndex + badMatches[i].length < input.length && input[badMatchesIndex + badMatches[i].length + 1].match(/\d/) !== null) {
          tempSearch = tempSearch.replace(badMatches[i], charToFix);
        } else {
          tempSearch = tempSearch.replace(badMatches[i], charToFix + " ");
        }
        input = input.substring(0, badMatchesIndex) + tempSearch;
        badMatchesIndex++;
      }
    }
    return input;
  };
  return {
    fixPeriodAndEllipsis: function(input) {
      input = input.replace(/^[ \.]+/g, "");
      const badPeriods = input.match(/\b([ \.]*\.[ \.]*)(\b|$)/g);
      let badPeriodsIndex = 0;
      let tempSearch = "";
      if (badPeriods !== null) {
        for (let i = 0; i < badPeriods.length; i++) {
          badPeriodsIndex = input.indexOf(badPeriods[i], badPeriodsIndex);
          if (badPeriods[i].split(".").length === 2) {
            tempSearch = input.substring(badPeriodsIndex);
            tempSearch = tempSearch.replace(badPeriods[i], ". ");
            input = input.substring(0, badPeriodsIndex) + tempSearch;
            badPeriodsIndex++;
          } else if (badPeriods[i].split(".").length >= 3) {
            tempSearch = input.substring(badPeriodsIndex);
            tempSearch = tempSearch.replace(badPeriods[i], "... ");
            input = input.substring(0, badPeriodsIndex) + tempSearch;
            badPeriodsIndex++;
          }
        }
      }
      return input;
    },
    fixSpaceAfterCharacter: function(input) {
      for (let i = 0; i < validCharsToFix.length; i++) {
        input = fixer(input, validCharsToFix[i]);
      }
      return input;
    }
  };
}
function TextAutoCorrector_ShortHandText() {
  const map = shortHandTextDataSet_default;
  const unstretchify = function(word, indicees, pivot) {
    if (typeof map[word] !== "undefined") {
      return map[word];
    } else if (!spellchecker.isMisspelled(word)) {
      return word;
    } else if (indicees.reduce((acc, cur) => {
      return acc + (cur.endIndex - cur.startIndex);
    }, 0) === 0) {
      return "";
    } else {
      const indiceesArrayIndex = pivot > 0 ? pivot - 1 : indicees.length - 1;
      if (indicees[indiceesArrayIndex].endIndex > indicees[indiceesArrayIndex].startIndex) {
        indicees[indiceesArrayIndex].endIndex = indicees[indiceesArrayIndex].endIndex - 1;
        word = word.substring(0, indicees[indiceesArrayIndex].startIndex) + word.substring(indicees[indiceesArrayIndex].startIndex + 1);
      } else {
        if (pivot > 0) {
          pivot = pivot - 1;
        } else {
          pivot = indicees.length - 1;
        }
      }
      return unstretchify(word, indicees, pivot);
    }
  };
  return {
    fixStretching: function(input) {
      let container = [];
      if (Array.isArray(input)) {
        container = input;
      } else if (typeof input === "string") {
        container = input.split(" ");
      } else {
        return "";
      }
      let stretchedIndicees = [];
      let lastMarkedChar = "";
      let tempWord = "";
      for (let i = 0; i < container.length; i++) {
        for (let j = 0; j < container[i].length; j++) {
          if (j > 0) {
            if (container[i][j] === container[i][j - 1]) {
              if (lastMarkedChar === "") {
                stretchedIndicees.push({
                  "startIndex": j - 1,
                  "endIndex": j
                });
                lastMarkedChar = container[i][j];
              } else {
                stretchedIndicees[stretchedIndicees.length - 1]["endIndex"] = j;
              }
            } else {
              lastMarkedChar = "";
            }
          }
        }
        if (canSpellcheck && stretchedIndicees.length > 0 && typeof container[i] !== "undefined" && spellchecker.isMisspelled(container[i])) {
          let fixed = "";
          let staticIndicees = JSON.parse(JSON.stringify(stretchedIndicees));
          for (let pivot = 0; pivot < staticIndicees.length; pivot++) {
            fixed = unstretchify(container[i], staticIndicees, pivot);
            if (fixed !== "") {
              container[i] = fixed;
              break;
            }
            staticIndicees = JSON.parse(JSON.stringify(stretchedIndicees));
          }
        }
        stretchedIndicees = [];
        lastMarkedChar = "";
      }
      return container;
    },
    fixShorthand: function(input) {
      let punctuation = "";
      let container = [];
      let stripped = "";
      if (Array.isArray(input)) {
        container = input;
      } else if (typeof input === "string") {
        container = input.split(" ");
      } else {
        return "";
      }
      for (let i = 0; i < container.length; i++) {
        stripped = container[i].match(/([a-zA-Z0-9']*)([\?!\.;+]*)$/);
        if (typeof stripped[2] !== "") {
          punctuation = stripped[2];
        }
        stripped = stripped[1];
        if (typeof map[stripped] !== "undefined") {
          container[i] = map[stripped];
          if (punctuation !== "") {
            container[i] = container[i] + punctuation;
            punctuation = "";
          }
        }
      }
      return container;
    }
  };
}
function TextAutoCorrector_offlineExactMatch() {
  const list = offlineExactMatchDataSet_default;
  return {
    fixSeparated: function(input) {
      let container = [];
      if (Array.isArray(input)) {
        container = input;
      } else if (typeof input === "string") {
        container = input.split(" ");
      } else {
        return "";
      }
      let listIndex = 0;
      if (container.length > 1) {
        for (let i = 1; i < container.length; i++) {
          listIndex = list.indexOf((container[i - 1] + container[i]).toLowerCase());
          if (listIndex >= 0) {
            container[i - 1] = list[listIndex];
            container.splice(i, 1);
            i--;
          }
        }
      }
      return container;
    }
  };
}
function TextAutoCorrector_Numbers() {
}
export {
  src_default as default
};
