import { Editor, Element as SlateElement } from 'slate';
import { CustomEditor } from './custom-types';
import {
  isEmptyNodeOnDeleteBackwards,
  isEmptyNodeOnDeleteForwards
} from './utils';

export const withTables = (editor: CustomEditor): CustomEditor => {
  const { deleteBackward, deleteForward, insertBreak } = editor;

  editor.deleteBackward = unit => {
    if (isEmptyNodeOnDeleteBackwards(editor, 'table-cell')) return;
    deleteBackward(unit);
  };

  editor.deleteForward = unit => {
    if (isEmptyNodeOnDeleteForwards(editor, 'table-cell')) return;
    deleteForward(unit);
  };

  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: n => SlateElement.isElement(n) && n.type === 'table'
      });

      if (table) {
        return;
      }
    }

    insertBreak();
  };

  return editor;
};
