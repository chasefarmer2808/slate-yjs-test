import { withCursor, withYjs, useCursors, SyncElement } from 'slate-yjs';
import React, { useMemo } from 'react';
import { withTables } from './plugins/withTables';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHtml } from './plugins/withHtml';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { withOps } from './plugins/withOps';
import { EditorFrame } from './EditorFrame';

interface YjsEditorProps {
  sharedType: Y.Array<SyncElement>;
  provider: WebsocketProvider;
}

export const YjsEditor: React.FC<YjsEditorProps> = ({
  sharedType,
  provider
}) => {
  const editor = useMemo(() => {
    return withCursor(
      withYjs(
        withOps(withTables(withHtml(withReact(createEditor())))),
        sharedType
      ),
      provider.awareness
    );
  }, [provider.awareness, sharedType]);

  const { decorate } = useCursors(editor);

  return <EditorFrame editor={editor} initialValue={[]} decorate={decorate} />;
};
