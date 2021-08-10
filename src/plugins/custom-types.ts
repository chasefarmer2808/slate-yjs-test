import { ReactEditor } from 'slate-react';
import { CursorEditor, YjsEditor } from 'slate-yjs';

export type CustomEditor = ReactEditor & YjsEditor & CursorEditor;
export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  isCaret?: boolean;
  data?: any;
  [key: string]: any;
};
export type CustomText = FormattedText;

export type ParagraphAlignment = 'left' | 'center' | 'right';
export const isParagraphAlignment = (
  format: string
): format is ParagraphAlignment => ['left', 'center', 'right'].includes(format);
export type AlignableElement = {
  align?: ParagraphAlignment;
};

export type ParagraphElement = AlignableElement & {
  type: 'paragraph';
  children: CustomText[];
};
export type UnorderedListElement = AlignableElement & {
  type: 'ul';
  children: ListItemElement[];
};
export type OrderedListElement = AlignableElement & {
  type: 'ol';
  children: ListItemElement[];
};
export type ListItemElement = {
  type: 'list-item';
  children: CustomElement[];
};
export type ImageElement = {
  type: 'image';
  src: string;
  ocrText?: string;
  children: CustomElement[];
};
export type TableElement = {
  type: 'table';
  children: CustomElement[];
};
export type TableRowElement = {
  type: 'table-row';
  children: CustomElement[];
};
export type TableCellElement = {
  type: 'table-cell';
  children: CustomElement[];
};
export type CustomElement =
  | CustomText
  | ParagraphElement
  | ListItemElement
  | UnorderedListElement
  | OrderedListElement
  | ImageElement
  | TableElement
  | TableRowElement
  | TableCellElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
