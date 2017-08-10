var Localize = require('localize');

const myLocalize = new Localize({
    // view names
    "Facilities": {
      "cs": "Budovy"
    },
    "Massages": {
      "cs": "Masáže"
    },
    "My Massages": {
      "cs": "Moje masáže"
    },
    "Profile": {
      "cs": "Profil"
    },

    // notification messages
    "Your request has been successful.": {
      "cs": "Váš požadavek byl úspěšný."
    },
    "Your request has ended unsuccessfully.": {
      "cs": "Váš požadavek skončil neúspěšně."
    },
    "An error occured!": {
      "cs": "Nastala chyba!"
    },
    "page doesn't exist:": {
      "cs": "stránka neexistuje:"
    }
});

if (localStorage.getItem("sh-locale") === 'en') {
  myLocalize.setLocale("en");
} else {
  myLocalize.setLocale("cs");
  localStorage.setItem("sh-locale", "cs");
}

export default myLocalize;
