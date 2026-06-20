export interface TranslationKeys {
  common: {
    loading: string;
    errorTitle: string;
    successTitle: string;
    backToHome: string;
  };
  navbar: {
    home: string;
    login: string;
    logout: string;
  };
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    rememberMe: string;
    button: string;
    loading: string;
    errorInvalid: string;
  };
  home: {
    title: string;
    welcome: string;
    profileInfo: string;
    realName: string;
    email: string;
    className: string;
    notSelected: string;
    needLogin: string;
    loginButton: string;
    databaseTestTitle: string;
    testNameLabel: string;
    testNamePlaceholder: string;
    addTestButton: string;
    testListTitle: string;
    noTests: string;
    addedSuccess: string;
  };
  studentDashboard: {
    availableTests: string;
    completedTests: string;
  };
  teacherDashboard: {
    myFolders: string;
    myClasses: string;
    createTestButton: string;
  };
  createTest: {
    title: string;
    defaultTestTitle: string;
    cancel: string;
    saveTest: string;
    saving: string;
    saved: string;
    noPages: string;
    noPagesSub: string;
    addFirstPage: string;
    addNewPage: string;
    page: string;
    randomizePage: string;
    noTasks: string;
    addTask: string;
    typeLabel: string;
    randomizeTask: string;
    randomizeElement: string;
    addElement: string;
    addTextElement: string;
    addQuestionElement: string;
    addTextSegment: string;
    addBlank: string;
    addItem: string;
    addCategory: string;
    defaultBlankText: string;
    ptsLabel: string;
    manualGrade: string;
    isCorrect: string;
    markCorrect: string;
    taskTypes: {
      multipleChoice: string;
      trueOrFalse: string;
      textInput: string;
      fillInTheBlanks: string;
      matching: string;
      numerical: string;
    };
    tooltips: {
      deletePage: string;
      deleteTask: string;
      deleteElement: string;
      moveUp: string;
      moveDown: string;
      changeLanguage: string;
    };
    placeholders: {
      testTitle: string;
      taskHeader: string;
      statement: string;
      option: string;
      questionPart: string;
      exactNumber: string;
      bodyText: string;
      correctAnswer: string;
      select: string;
      trueOption: string;
      falseOption: string;
      categoryName: string;
      itemText: string;
    };
  };
}
