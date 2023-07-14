const { diContainer } = require('@fastify/awilix');
const { asClass, asValue, asFunction, Lifetime } = require('awilix');
const { v4: uuidv4 } = require('uuid');

const App = require('./app');
const WebFramework = require('./web-framework');
const router = require('./web-framework/router');
const config = require('../../config/index');
const utilities = { uuidv4 };

const { sequelize: database, User: UserModel } = require('../_db');

const UsersDatabaseRepository = require('../users/data/repository');

const UsersRouter = require('../users/interfaces/router');
const UserSerializer = require('../users/interfaces/serializer');

const { BrowseUsers, ReadUser, EditUser, AddUser, DeleteUser } = require('../users/actions');

diContainer.register({
  config: asValue(config),
  database: asValue(database),
  App: asClass(App, {
    lifetime: Lifetime.SINGLETON,
  }),
  WebFramework: asClass(WebFramework, {
    lifetime: Lifetime.SINGLETON,
  }),
  router: asFunction(router, {
    lifetime: Lifetime.SINGLETON,
  }),
  UsersRouter: asClass(UsersRouter, {
    lifetime: Lifetime.SINGLETON,
  }),
  UserSerializer: asValue(UserSerializer),
  UserModel: asValue(UserModel),
  UsersDatabaseRepository: asClass(UsersDatabaseRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  utilities: asValue(utilities, {
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
  }),
});

module.exports = diContainer;