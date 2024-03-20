import { Button } from '@opensumi/ide-components';
import { EditorCollectionService, IResource } from '@opensumi/ide-editor';
import * as React from 'react';
import { useEffect, useRef } from 'react';

import type { IStandaloneCodeEditor } from '@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor';

import { useInjectable } from '@opensumi/ide-core-browser';
import {
  ICodeEditor,
  IEditorDocumentModelService,
} from '@opensumi/ide-editor/lib/browser';
import {
  CustomEditorDocumentContentProvider,
  TokenCustomEditorDocumentContentProvider,
} from './custom-document-provider';
import styles from './monaco-services.module.less';

// 可以从props中拿到 IResource，进而获得相关的资源信息
// You can obtain information about the corresponding resource by accessing IResource through props.
export const CutsomMonacoEditorView = (props: { resource: IResource }) => {
  const { resource } = props;

  const uri = resource.uri;

  // 通过 resource.meta 传递信息的示例
  const { param1, param2 } = resource.metadata || {};
  console.log('param1: ', param1, ' param2: ', param2);

  // 替换 fileURI 为 我们自定义协议的URI，也可以在这一步植入参数
  const customUri = uri
    .withScheme('custom-scheme')
    .withQuery('customParam1=abchello'); // 植入自定义Query参数，用于在DocumentProvider中通过参数做一些自定义的事情

  const editorCollectionService: EditorCollectionService = useInjectable(
    EditorCollectionService,
  );
  const docManager: IEditorDocumentModelService = useInjectable(
    IEditorDocumentModelService,
  );
  const docProvider: CustomEditorDocumentContentProvider = useInjectable(
    TokenCustomEditorDocumentContentProvider,
  );

  const editorHtmlRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<IStandaloneCodeEditor>(null);
  const iCodeEditorRef = useRef<ICodeEditor>(null);

  // init monaco CodeEditor
  useEffect(() => {
    if (editorHtmlRef.current && !editorRef.current) {
      const editor2 = editorCollectionService.createCodeEditor(
        editorHtmlRef.current,
        {
          value: '',
          automaticLayout: true,
          readOnly: false,
          minimap: {
            enabled: false,
          },
        },
      );

      // @ts-ignore
      iCodeEditorRef.current = editor2;

      setTimeout(() => {
        editor2.layout();
      }, 0);

      docManager
        .createModelReference(customUri, 'editor-react-component')
        .then((ref) => {
          editor2.open(ref);
        })
        .catch(console.error);

      // @ts-ignore
      editorRef.current = editor2.monacoEditor;
    }
  }, [editorHtmlRef.current]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className={styles.title}>Monaco in Custom Editor Component</div>
      <div style={{ display: 'flex', marginBottom: '4px' }}>
        <Button
          style={{ marginLeft: '4px', marginRight: '8px' }}
          onClick={() => {
            // 手动触发 Document Changed 事件，模拟来自于watcher或者其他情况下的Document Provider中Document来自外部修改的情况
            docProvider.fireDidChangeContent(customUri);
          }}
        >
          Notify Change
        </Button>
        <Button
          onClick={() => {
            // 需要在 custom-document-provider 中实现文档保存逻辑
            iCodeEditorRef.current?.save();
          }}
        >
          Fake Save
        </Button>
      </div>
      <div
        ref={editorHtmlRef}
        style={{ width: '100%', flexGrow: 1 }}
        className={`${'monaco-editor-container'}`}
      />
    </div>
  );
};
