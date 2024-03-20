import { CheckBox, RecycleList } from '@opensumi/ide-components';
import { useInjectable, ViewState } from '@opensumi/ide-core-browser';
import * as React from 'react';

import { ITodo, ITodoService } from '../common';
import styles from './todo.module.less';

export const Todo = ({
  viewState,
}: React.PropsWithChildren<{ viewState: ViewState }>) => {
  const { width, height } = viewState;
  const [todos, setTodos] = React.useState<ITodo[]>([
    {
      description: 'First Todo',
      isChecked: true,
    },
  ]);
  const { showMessage, handleContextMenu, onDidChange } =
    useInjectable<ITodoService>(ITodoService);

  React.useEffect(() => {
    const disposable = onDidChange((value: string) => {
      const newTodos = todos.slice(0);
      newTodos.push({
        description: value,
        isChecked: false,
      });
      setTodos(newTodos);
    });
    return () => {
      disposable.dispose();
    };
  }, [todos]);

  const template = ({ data, index }: { data: ITodo; index: number }) => {
    const handlerChange = () => {
      const newTodos = todos.slice(0);
      newTodos.splice(index, 1, {
        description: data.description,
        isChecked: !data.isChecked,
      });
      showMessage(`Set ${data.description} to be ${!data.isChecked}`);
      setTodos(newTodos);
    };
    return (
      <div
        className={styles.todo_item}
        key={`${data.description + index}`}
        onContextMenu={(e) => handleContextMenu(e, data)}
      >
        <CheckBox
          checked={data.isChecked}
          onChange={handlerChange}
          label={data.description}
        />
      </div>
    );
  };

  return (
    <RecycleList
      className={styles.todo}
      height={height}
      width={width - 20}
      itemHeight={24}
      data={todos}
      template={template}
    />
  );
};
