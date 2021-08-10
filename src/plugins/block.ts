import { Editor, Transforms, Element as SlateElement } from 'slate';
import { CustomEditor } from './custom-types';

const LIST_TYPES = ['ul', 'ol'];
const BLOCK_TYPES = [...LIST_TYPES];

export const toggleBlock = (
  editor: CustomEditor,
  format: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  attrs?: any
): void => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => SlateElement.isElement(n) && BLOCK_TYPES.includes(n.type),
    split: true
  });

  if (isList) {
    const newProps: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format
    };
    Transforms.setNodes(editor, newProps);
  } else {
    // Replace li tags with p tags.
    Transforms.setNodes(editor, {
      type: 'paragraph'
    });
  }

  if (!isActive) {
    const block = { type: format, children: [], ...attrs };
    Transforms.wrapNodes(editor, block);
  }
};

export const isBlockActive = (editor: Editor, format: string): boolean => {
  const [match] = Editor.nodes(editor, {
    match: n => SlateElement.isElement(n) && n.type === format
  });

  return !!match;
};

export {};
