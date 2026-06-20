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
    title: "Új teszt létrehozása",
    defaultTestTitle: "Névtelen teszt",
    cancel: "Mégsem",
    saveTest: "Teszt mentése",
    saving: "Mentés folyamatban...",
    saved: "Mentve!",
    noPages: "Még nincsenek oldalak",
    noPagesSub: "Kezdje egy új oldal hozzáadásával.",
    addFirstPage: "Első oldal hozzáadása",
    addNewPage: "Új oldal",
    page: "Oldal",
    randomizePage: "Oldal pozíciójának keverése",
    noTasks: "Még nincsenek feladatok az oldalon.",
    addTask: "Feladat hozzáadása",
    typeLabel: "Típus:",
    randomizeTask: "Feladat pozíciójának keverése",
    randomizeElement: "Elem keverése",
    addElement: "Elem hozzáadása",
    addTextElement: "Szöveg hozzáadása",
    addQuestionElement: "Kérdés hozzáadása",
    addTextSegment: "Szövegrész hozzáadása",
    addBlank: "Üres hely hozzáadása",
    addItem: "Elem hozzáadása",
    addCategory: "Kategória hozzáadása",
    defaultBlankText: "Üres hely",
    ptsLabel: "Pont:",
    manualGrade: "Kézi javítás",
    isCorrect: "Helyes válasz",
    markCorrect: "Helyesnek jelöl",
    taskTypes: {
      multipleChoice: "Feleletválasztós",
      trueOrFalse: "Igaz / Hamis",
      textInput: "Szövegbevitel",
      fillInTheBlanks: "Hiányos szöveg",
      matching: "Párosítás",
      numerical: "Numerikus"
    },
    tooltips: {
      deletePage: "Oldal törlése",
      deleteTask: "Feladat törlése",
      deleteElement: "Elem törlése",
      moveUp: "Mozgatás fel",
      moveDown: "Mozgatás le",
      changeLanguage: "Nyelv megváltoztatása"
    },
    placeholders: {
      testTitle: "Teszt címének megadása...",
      taskHeader: "Kérdés vagy feladat megadása...",
      statement: "Állítás...",
      option: "Válaszlehetőség ",
      questionPart: "Kérdés rész...",
      exactNumber: "Pontos szám...",
      bodyText: "Szöveg...",
      correctAnswer: "Helyes válasz...",
      select: "Kiválasztás...",
      trueOption: "Igaz",
      falseOption: "Hamis",
      categoryName: "Kategória neve",
      itemText: "Elem szövege"
    }
  }
};
