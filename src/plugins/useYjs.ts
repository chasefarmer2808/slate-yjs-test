import { useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { SyncElement, toSharedType } from 'slate-yjs';
import { WebsocketProvider } from 'y-websocket';
import { Descendant } from 'slate';
import randomColor from 'randomcolor';

export const useYjs = (
  noteId: string,
  initialValue: Descendant[]
): [
  sharedType: Y.Array<SyncElement>,
  provider: WebsocketProvider,
  isSynced: boolean
] => {
  const [isSyncedState, setIsSyncedState] = useState(false);

  const [sharedType, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const sharedType = doc.getArray<SyncElement>('content');
    const provider = new WebsocketProvider('ws://localhost:1234', noteId, doc, {
      connect: false
    });

    return [sharedType, provider];
  }, [noteId]);

  const cursorColor = useMemo(
    () =>
      randomColor({
        luminosity: 'dark',
        format: 'rgba',
        alpha: 1
      }),
    []
  );

  useEffect(() => {
    const syncHandler = (isSynced: boolean) => {
      if (isSynced && sharedType.length === 0) {
        toSharedType(sharedType, initialValue);
      }
      setIsSyncedState(true);
    };

    provider.on('sync', syncHandler);

    provider.awareness.setLocalState({
      id: provider.awareness.clientID,
      color: cursorColor,
      name: 'test'
    });

    provider.connect();

    return () => {
      // Remove all event handlers and disconnect from the websocket.
      provider.off('sync', syncHandler);
      provider.disconnect();
    };
  }, [provider, sharedType, initialValue, cursorColor]);

  return [sharedType, provider, isSyncedState];
};
