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
  };
}
