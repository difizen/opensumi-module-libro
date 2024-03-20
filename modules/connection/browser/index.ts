import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

import { ITodoConnectionServerPath, ITodoService } from '../common';
import { TodoContribution } from './todo.contribution';
import { TodoService } from './todo.service';

@Injectable()
export class TodoListModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ITodoService,
      useClass: TodoService,
    },
    TodoContribution,
  ];

  backServices = [
    {
      servicePath: ITodoConnectionServerPath, // 双端通信通道唯一路径
      clientToken: ITodoService, // 关联前端服务
    },
  ];
}
