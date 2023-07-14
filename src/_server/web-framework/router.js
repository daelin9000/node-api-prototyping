module.exports = ({ UsersRouter }) => {
    return (app, opts, done) => {
      app.register(UsersRouter.router);
      done();
    };
  };