import {
  Descendant,
  Editor,
  Element as SlateElement,
  Point,
  Range,
  Transforms
} from 'slate';
import { CustomEditor } from './custom-types';
import { deserialize } from './withHtml';

export const isEmptyNodeOnDeleteBackwards = (
  editor: CustomEditor,
  nodeType: string
): boolean => {
  const { selection } = editor;
  if (selection && Range.isCollapsed(selection)) {
    const [node] = Editor.nodes(editor, {
      match: n => SlateElement.isElement(n) && n.type === nodeType
    });

    if (node) {
      const [, nodePath] = node;
      const start = Editor.start(editor, nodePath);
      if (Point.equals(selection.anchor, start)) {
        return true;
      }
    }
  }

  return false;
};

export const isEmptyNodeOnDeleteForwards = (
  editor: CustomEditor,
  nodeType: string
): boolean => {
  const { selection } = editor;
  if (selection && Range.isCollapsed(selection)) {
    const [node] = Editor.nodes(editor, {
      match: n => SlateElement.isElement(n) && n.type === nodeType
    });

    if (node) {
      const [, nodePath] = node;
      const end = Editor.end(editor, nodePath);
      if (Point.equals(selection.anchor, end)) {
        return true;
      }
    }
  }

  return false;
};

export const clearEditor = (editor: CustomEditor): void => {
  if (editor.children.length === 0) return;

  const start = Editor.start(editor, []);
  const end = Editor.end(editor, []);
  Transforms.removeNodes(editor, {
    at: { anchor: start, focus: end },
    mode: 'highest'
  });
};
