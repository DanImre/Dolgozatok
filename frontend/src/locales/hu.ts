import type { TranslationKeys } from './translationKeys';

export const hu: TranslationKeys = {
  common: {
    loading: "Betöltés...",
    errorTitle: "Hiba történt",
    successTitle: "Sikeres művelet",
    backToHome: "Vissza a főoldalra"
  },
  navbar: {
    home: "Főoldal",
    login: "Bejelentkezés",
    logout: "Kijelentkezés"
  },
  login: {
    title: "Üdvözöljük újra",
    subtitle: "Kérjük, jelentkezzen be a fiókjába",
    emailLabel: "E-mail cím",
    emailPlaceholder: "nev@pelda.hu",
    passwordLabel: "Jelszó",
    passwordPlaceholder: "••••••••",
    rememberMe: "Emlékezz rám",
    button: "Bejelentkezés",
    loading: "Bejelentkezés folyamatban...",
    errorInvalid: "Sikertelen bejelentkezés. Helytelen e-mail vagy jelszó!"
  },
  home: {
    title: "Kezdőlap",
    welcome: "Üdvözöljük,",
    profileInfo: "Felhasználói profil adatok",
    realName: "Név",
    email: "E-mail cím",
    className: "Osztály",
    notSelected: "Nincs megadva",
    needLogin: "Kérjük, a funkciók eléréséhez jelentkezzen be.",
    loginButton: "Ugrás a bejelentkezésre",
    databaseTestTitle: "Adatbázis tesztelése",
    testNameLabel: "Teszt neve",
    testNamePlaceholder: "Pl. Matematika Témazáró",
    addTestButton: "Teszt hozzáadása",
    testListTitle: "Elérhető tesztek a rendszerben",
    noTests: "Nincsenek tesztek az adatbázisban.",
    addedSuccess: "Teszt sikeresen hozzáadva!"
  },
  studentDashboard: {
    availableTests: "Kitölthető tesztek",
    completedTests: "Korábban kitöltött tesztek"
  },
  teacherDashboard: {
    myFolders: "Mappáim",
    myClasses: "Osztályaim",
    createTestButton: "Teszt létrehozása"
  },
  createTest: {
    title: "Új teszt létrehozása"
  }
};
