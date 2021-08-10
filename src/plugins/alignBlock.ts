import {
  CustomEditor,
  ParagraphAlignment,
  AlignableElement,
  CustomElement
} from './custom-types';
import { Editor, Transforms } from 'slate';

export const alignBlock = (
  editor: CustomEditor,
  format: ParagraphAlignment
): void => {
  if (!editor.selection) return;
  // Need the closest paragraph element ancestor from the selection.
  const [[block, location]] = Editor.nodes(editor, {
    match: n => isAlignableElement(n)
  });

  // Then, check if the alignment is already set.  Perform toggle or switch as necessary.
  const alignableElement: AlignableElement = block as AlignableElement;
  if (alignableElement.align !== format) {
    // Finally, set the new alignment using Transforms.setNodes, passing the location of the
    // proper paragraph element.
    Transforms.setNodes(editor, { align: format }, { at: location });
  }
};

export const isAlignActive = (
  editor: Editor,
  align: ParagraphAlignment
): boolean => {
  const [match] = Editor.nodes(editor, {
    match: n => isAlignableElement(n) && n.align === align
  });

  return !!match;
};

const isAlignableElement = (n: CustomElement): boolean => {
  return ['paragraph', 'ol', 'ul'].includes(n.type);
};
