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
    title: "Create a New Test"
  }
};
