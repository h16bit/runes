﻿(function () {

    if (runes) {

        var lexRegistrationArray = [];

        function getMatchedLex(lexChar) {
            var matchedLex = undefined;

            for (var i = 0; i < lexRegistrationArray.length; i++) {
                var lex = lexRegistrationArray[i];

                for (var descriptionKey in lex.lexDescription) {
                    var lexRegex = lex.lexDescription[descriptionKey];
                    if (Array.isArray(lexRegex)) {
                        break;
                    }

                    if (lexChar.match(lexRegex)) {
                        matchedLex = {
                            "lexName": lex.lexName,
                            "lexDescription": lex.lexDescription,
                            "lexSubName": descriptionKey
                        };
                    }

                }

                if (matchedLex) break;
            }

            return matchedLex;
        }

        function getDoubleCheckedLex(matchedLexValue, matchedLex) {
            var doubleCheckedLex = undefined;

            for (var i = 0; i < lexRegistrationArray.length; i++) {
                var lex = lexRegistrationArray[i];

                for (var descriptionKey in lex.lexDescription) {
                    var lexArray = lex.lexDescription[descriptionKey];
                    if (!Array.isArray(lexArray)) {
                        break;
                    }

                    var stringToMatch = lexArray[0];

                    if (matchedLexValue.indexOf(stringToMatch) === 0) {
                        doubleCheckedLex = {
                            "lexName": lex.lexName,
                            "lexDescription": lex.lexDescription,
                            "lexSubName": descriptionKey
                        };
                    }
                }

                if (doubleCheckedLex) break;
            }

            return doubleCheckedLex || matchedLex;
        }

        runes.lexer = {
            analize: function (stringToAnalize) {
                var charArray = stringToAnalize.split("");
                var currentLex = undefined;
                var lastIndex = 0;
                var resultLexArray = [];

                for (var i = 0; i < charArray.length; i++) {
                    var matchedLex = getMatchedLex(charArray[i]);

                    if (matchedLex) {
                        currentLex = currentLex || matchedLex;
                        if (matchedLex.lexName !== currentLex.lexName) {
                            var matchedLexValue = stringToAnalize.substr(lastIndex, i - lastIndex);
                            var doubleCheckedLex = getDoubleCheckedLex(matchedLexValue, currentLex);

                            resultLexArray.push({
                                startIndex: lastIndex,
                                endIndex: i,
                                lexName: doubleCheckedLex.lexName,
                                lexSubName: doubleCheckedLex.lexSubName,
                                lexValue: matchedLexValue
                            });


                            lastIndex = i;
                            currentLex = matchedLex;
                        }
                    } else {
                        throw new Error("no matched LEX was found at - " + i);
                    }
                }


                return resultLexArray;
            }
        }

        runes.lexer.L = function (lexName, lexDescription) {
            lexRegistrationArray.push({ "lexName": lexName, "lexDescription": lexDescription });
        }

    } else {
        throw new Error("runes module didn't loaded");
    }

})();