module.exports = ({ UsersHttpAdapter }) => {
    return (app, opts, done) => {
      app.register(UsersHttpAdapter.router);
      done();
    };
  };