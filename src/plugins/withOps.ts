import { Editor, Operation } from 'slate';

export const withOps = (editor: Editor): Editor => {
  const { apply } = editor;
  editor.apply = (operation: Operation) => {
    console.log(operation);
    apply(operation);
  };

  return editor;
};
