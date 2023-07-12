class App {
  constructor({ WebFramework, database }) {
    this.WebFramework = WebFramework;
    this.database = database;
  }

  async start() {
    if (this.database) {
      await this.database.authenticate();
    }

    await this.WebFramework.start();
  }
}

module.exports = App;
