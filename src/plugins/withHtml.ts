import escapeHtml from 'escape-html';
import { Descendant, Node, Text, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { CustomEditor, CustomElement, ImageElement } from './custom-types';

export const withHtml = (editor: CustomEditor): CustomEditor => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element: CustomElement) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data: DataTransfer) => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const fragment = deserialize(parsed.body);
      Transforms.insertNodes(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deserialize = (el: HTMLElement): any => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  }

  const { nodeName } = el;
  const parent = el;

  const children = Array.from(parent.childNodes)
    .map(child => deserialize(child as HTMLElement))
    .flat();

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  switch (nodeName) {
    case 'P': {
      // Make sure we have at least one empty text node, or Slate throws an error.
      if (children.length === 0) {
        children.push({ text: '' });
      }

      const attrs: { [key: string]: string } = { type: 'paragraph' };

      if (el.style !== undefined && el.style.textAlign) {
        attrs.align = el.style.textAlign;
      }

      return jsx('element', { ...attrs }, children);
    }
    case 'UL':
    case 'OL': {
      const attrs: { [key: string]: string } = { type: nodeName.toLowerCase() };

      if (el.dir !== '') {
        attrs.align = el.dir === 'rtl' ? 'right' : 'auto';
      }
      return jsx('element', { ...attrs }, children);
    }
    case 'LI':
      return jsx('element', { type: 'list-item' }, children);
    case 'STRONG':
      return children.map(child => jsx('text', { bold: true }, child));
    case 'EM':
      return children.map(child => jsx('text', { italic: true }, child));
    case 'U':
      return children.map(child => jsx('text', { underline: true }, child));
    case 'DEL':
      return children.map(child => jsx('text', { strikethrough: true }, child));
    case 'IMG':
      if (children.length === 0) {
        children.push({ text: '' });
      }
      return jsx(
        'element',
        {
          type: 'image',
          src: el.getAttribute('src'),
          ocrText: el.getAttribute('ocrText')
        },
        children
      );
    case 'TABLE':
      return jsx('element', { type: 'table' }, children);
    case 'TR':
      return jsx('element', { type: 'table-row' }, children);
    case 'TD':
      return jsx('element', { type: 'table-cell' }, children);
  }

  return children;
};

export const serialize = (node: Node): string => {
  if (Text.isText(node)) {
    let text = escapeHtml(node.text);

    if (node.bold) {
      text = `<strong>${text}</strong>`;
    }

    if (node.italic) {
      text = `<em>${text}</em>`;
    }

    if (node.underline) {
      text = `<u>${text}</u>`;
    }

    if (node.strikethrough) {
      text = `<del>${text}</del>`;
    }

    return text;
  }

  const children: string = node.children
    .map((n: Descendant) => serialize(n))
    .join('');

  switch ((node as CustomElement).type) {
    case 'paragraph':
      if (node.align !== undefined) {
        const styleStr = `text-align: ${node.align}`;
        return `<p style="${styleStr}">${children}</p>`;
      }
      return `<p>${children}</p>`;
    case 'ul':
      if (node.align !== undefined) {
        return `<ul dir="${
          node.align === 'right' ? 'rtl' : 'auto'
        }">${children}</ul>`;
      }
      return `<ul>${children}</ul>`;
    case 'ol':
      if (node.align !== undefined) {
        return `<ol dir="${
          node.align === 'right' ? 'rtl' : 'auto'
        }">${children}</ol>`;
      }
      return `<ol>${children}</ol>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'image': {
      const imgNode = node as ImageElement;
      if (imgNode.ocrText === undefined) {
        return `<img src=${imgNode.src} />`;
      }
      return `<img src="${imgNode.src}" ocrText="${imgNode.ocrText}" />`; // Must wrap string literals in double quotes.
    }
    case 'table':
      return `<table>${children}</table>`;
    case 'table-row':
      return `<tr>${children}</tr>`;
    case 'table-cell':
      return `<td>${children}</td>`;
    default:
      return children;
  }
};

export {};
