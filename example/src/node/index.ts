import { ExpressFileServerModule } from '@opensumi/ide-express-file-server/lib/node';
import { CommonNodeModules } from './common-modules';
import { startServer } from './start-server';

import { TodoListModule } from 'modules/connection/node';

startServer({
  modules: [...CommonNodeModules, ExpressFileServerModule, TodoListModule],
});
