const { diContainer } = require('fastify-awilix');
const { asClass, asValue, asFunction, Lifetime } = require('awilix');

const App = require('./app');
const WebFramework = require('./web-framework');
const router = require('./web-framework/router');
const config = require('../config/index');

const PeopleHttpAdapter = require('./people/interfaces/PeopleHttpAdapter');
const PersonSerializer = require('./people/interfaces/PersonSerializer');
const { BrowsePeople/* , ReadUser, EditUser, AddUser, DeleteUser */ } = require('./people/use-cases');

const { Person: PersonModel } = require('../_db/models');
const PeopleDatabaseRepository = require('./people/persistence/PeopleDatabaseRepository');

diContainer.register({
  config: asValue(config),
  App: asClass(App, {
    lifetime: Lifetime.SINGLETON,
  }),
  WebFramework: asClass(WebFramework, {
    lifetime: Lifetime.SINGLETON,
  }),
  router: asFunction(router, {
    lifetime: Lifetime.SINGLETON,
  }),
  /* UsersHttpAdapter: asClass(UsersHttpAdapter, {
    lifetime: Lifetime.SINGLETON,
  }),
  UserSerializer: asValue(UserSerializer),
  UserModel: asValue(UserModel),
  UsersDatabaseRepository: asClass(UsersDatabaseRepository, {
    lifetime: Lifetime.SINGLETON,
  }), */
  /* utilities: asValue(utilities, {
    lifetime: Lifetime.SINGLETON,
  }),
  BrowseUsers: asClass(BrowseUsers, {
    lifetime: Lifetime.SCOPED,
  }),
  ReadUser: asClass(ReadUser, {
    lifetime: Lifetime.SCOPED,
  }),
  EditUser: asClass(EditUser, {
    lifetime: Lifetime.SCOPED,
  }),
  AddUser: asClass(AddUser, {
    lifetime: Lifetime.SCOPED,
  }),
  DeleteUser: asClass(DeleteUser, {
    lifetime: Lifetime.SCOPED,
  }), */
});

module.exports = diContainer;