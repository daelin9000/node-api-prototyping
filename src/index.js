const diContainer = require('./_server/di-container');

const App = diContainer.resolve('App');

App.start();