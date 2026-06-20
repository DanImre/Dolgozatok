import type { TranslationKeys } from './translationKeys';

export const en: TranslationKeys = {
  common: {
    loading: "Loading...",
    errorTitle: "An error occurred",
    successTitle: "Operation successful",
    backToHome: "Back to Home"
  },
  navbar: {
    home: "Home",
    login: "Login",
    logout: "Log Out"
  },
  login: {
    title: "Welcome Back",
    subtitle: "Please log in to your account",
    emailLabel: "Email address",
    emailPlaceholder: "name@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    rememberMe: "Remember me",
    button: "Log In",
    loading: "Logging in...",
    errorInvalid: "Login failed. Incorrect email or password!"
  },
  home: {
    title: "Home",
    welcome: "Welcome,",
    profileInfo: "User Profile Information",
    realName: "Name",
    email: "Email address",
    className: "Class",
    notSelected: "Not specified",
    needLogin: "Please log in to access the system features.",
    loginButton: "Go to Login",
    databaseTestTitle: "Database Testing",
    testNameLabel: "Test Name",
    testNamePlaceholder: "e.g. Mathematics Test",
    addTestButton: "Add Test",
    testListTitle: "Tests Available in the System",
    noTests: "No tests found in database.",
    addedSuccess: "Test added successfully!"
  },
  studentDashboard: {
    availableTests: "Tests Available for You",
    completedTests: "Previously Filled Tests"
  },
  teacherDashboard: {
    myFolders: "My Folders",
    myClasses: "My Classes",
    createTestButton: "Create Test"
  },
  createTest: {
    title: "Create a New Test",
    defaultTestTitle: "Untitled Test",
    cancel: "Cancel",
    saveTest: "Save Test",
    noPages: "No pages yet",
    noPagesSub: "Start by adding a page to your test.",
    addFirstPage: "Add First Page",
    addNewPage: "Add New Page",
    page: "Page",
    randomizePage: "Randomize Page Position",
    noTasks: "No tasks on this page yet.",
    addTask: "Add Task",
    typeLabel: "Type:",
    randomizeTask: "Randomize Task Position",
    randomizeElement: "Randomize Element",
    addElement: "Add Element",
    addTextElement: "Add Text Element",
    addQuestionElement: "Add Question Element",
    addTextSegment: "Add Text Segment",
    addBlank: "Add Blank",
    addItem: "Add Item",
    addCategory: "Add Category",
    defaultBlankText: "Blank",
    ptsLabel: "Pts:",
    manualGrade: "Manual Grade",
    isCorrect: "Correct Option",
    markCorrect: "Mark Correct",
    taskTypes: {
      multipleChoice: "Multiple Choice",
      trueOrFalse: "True / False",
      textInput: "Text Input",
      fillInTheBlanks: "Fill in the Blanks",
      matching: "Matching",
      numerical: "Numerical"
    },
    tooltips: {
      deletePage: "Delete Page",
      deleteTask: "Delete Task",
      deleteElement: "Delete Element",
      moveUp: "Move Up",
      moveDown: "Move Down",
      changeLanguage: "Change Language"
    },
    placeholders: {
      testTitle: "Enter Test Title...",
      taskHeader: "Enter task question or header...",
      statement: "Statement...",
      option: "Option ",
      questionPart: "Question part...",
      exactNumber: "Exact number...",
      bodyText: "Body text...",
      correctAnswer: "Correct answer...",
      select: "Select...",
      trueOption: "True",
      falseOption: "False",
      categoryName: "Category Name",
      itemText: "Item text"
    }
  }
};
