const { fastifyAwilixPlugin } = require('@fastify/awilix');
const fastify = require('fastify');
const openApiGenerator = require('@fastify/swagger');

class WebFramework {
  constructor({ config, router }) {
    this.config = config;
    this.server = fastify({ logger: 'true' });
    this.router = router;
    this.openApiGenerator = openApiGenerator;
  }

  async start() {
    try {
      // Registrations
      this.server.register(fastifyAwilixPlugin, { disposeOnClose: true, disposeOnResponse: true });
      if (!this.config.isProduction) this.server.register(this.openApiGenerator, this.config.openApiSpec);
      this.server.register(this.router);

      // Schema Registrations

      // Status 400 - Bad Request
      this.server.addSchema({
        $id: 'BadRequestSchema',
        type: 'object',
        properties: {
          type: { type: 'string', example: 'Bad Request' },
          details: {
            type: 'string',
            example: 'The server cannot or will not process the request due to an apparent client error.',
          },
        },
      });

      // Status 404 - Not Found
      this.server.addSchema({
        $id: 'NotFoundSchema',
        type: 'object',
        properties: {
          type: { type: 'string', example: 'Not Found' },
          details: {
            type: 'string',
            example:
              'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.',
          },
        },
      });

      // Status 500 - Internal Error
      this.server.addSchema({
        $id: 'InternalErrorSchema',
        type: 'object',
        properties: {
          type: { type: 'string', example: 'Internal Server Error' },
          details: { type: 'string', example: 'An internal error has occured' },
        },
      });

      this.server.ready((err) => {
        if (err) throw err;

        // Only generate OpenAPI docs in non-production environments
        if (!this.config.isProduction) {
          this.server.swagger();
        }
      });

      await this.server.listen({ port: this.config.web.port, host: this.config.web.host });
    } catch (err) {
      this.server.log.error(err);
      process.exit(1);
    }
  }
}

module.exports = WebFramework;