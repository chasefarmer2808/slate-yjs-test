import CSS from 'csstype';
import React, { memo, useCallback, useState } from 'react';
import { Descendant } from 'slate';
import { Editable, RenderLeafProps, Slate, useSlate } from 'slate-react';
import styles from 'styles/components/EditorFrame.module.scss';
import {
  CustomEditor,
  isParagraphAlignment,
  ParagraphAlignment
} from './plugins/custom-types';
import Caret from './Caret';
import { alignBlock, isAlignActive } from './plugins/alignBlock';
import { isBlockActive, toggleBlock } from './plugins/block';
import { isMarkActive, toggleMark } from './plugins/mark';
import { Icon } from './common/Icon';

interface EditorFrameProps {
  editor: CustomEditor;
  initialValue: Descendant[];
  onAddPart?: (editor: CustomEditor) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decorate?: any;
}

interface ToolbarButtonProps {
  format: string | ParagraphAlignment;
  icon: string;
}

type ActiveFunc = (editor: CustomEditor, format: string) => boolean;
type AlignActiveFunc = (
  editor: CustomEditor,
  format: ParagraphAlignment
) => boolean;
type ToggleFunc = (editor: CustomEditor, format: string) => void;
type AlignToggleFunc = (
  editor: CustomEditor,
  format: ParagraphAlignment
) => void;

interface ToggleableToolbarButtonProps extends ToolbarButtonProps {
  isActiveFunc: ActiveFunc | AlignActiveFunc;
  toggleFunc: ToggleFunc | AlignToggleFunc;
}

interface AlignBlockMenuButtonProps {
  alignment: ParagraphAlignment;
  icon: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderElement = (props: any) => <Element {...props} />;

/**
 * Wrapper for just the Slate editor.
 * @param editor The editor instance.
 * @param value Initial value to render.
 * @param onAddPart
 * @param decorate Handles cursor updates.
 * @constructor
 */
export const EditorFrame: React.FC<EditorFrameProps> = ({
  editor,
  initialValue,
  onAddPart,
  decorate
}) => {
  const [value, setValue] = useState<Descendant[]>(initialValue);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderLeaf = useCallback(props => <Leaf {...props} />, [decorate]);

  // Custom key-down event handler.
  const handleKeyDownEvent = async (event: React.KeyboardEvent) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'Enter':
          if (!editor.selection) return;

          event.preventDefault();

          if (typeof onAddPart === 'function') {
            onAddPart(editor);
          }

          break;
      }
    }
  };

  return (
    <section className={styles['editor-container']}>
      <Slate editor={editor} value={value} onChange={val => setValue(val)}>
        <div className="flex">
          <MarkMenuButton format="bold" icon="bold" />
          <MarkMenuButton format="italic" icon="italic" />
          <MarkMenuButton format="underline" icon="underline" />
          <BlockMenuButton format="ul" icon="ul" />
          <BlockMenuButton format="ol" icon="ol" />
        </div>
        <Editable
          className={styles.editable}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          decorate={decorate}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={true}
          onKeyDown={handleKeyDownEvent}
        />
      </Slate>
    </section>
  );
};

/**
 * Abstract func. comp. for an element to be rendered in the editor, based on its type.  This is actually a callback
 * that gets fired after the descendents of the root editor have been changed.
 * @param attributes Custom fields on the element.
 * @param children Child elements to be recursively rendered.
 * @param element The element to be rendered.  Should be of type CustomElement.
 * @constructor
 */
// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
const Element: React.FC<any> = memo(({ attributes, children, element }) => {
  switch (true) {
    case element.type === 'ul':
      return (
        <ul {...attributes} dir={element.align === 'right' ? 'rtl' : 'auto'}>
          {children}
        </ul>
      );
    case element.type === 'ol':
      return (
        <ol {...attributes} dir={element.align === 'right' ? 'rtl' : 'auto'}>
          {children}
        </ol>
      );
    case element.type === 'list-item':
      return <li {...attributes}>{children}</li>;
    case element.type === 'table-row':
      return <tr {...attributes}>{children}</tr>;
    case element.type === 'table-cell':
      return <td {...attributes}>{children}</td>;
    default:
      return (
        <p {...attributes} style={{ textAlign: element.align }}>
          {children}
        </p>
      );
  }
});

/**
 * Callback for rendering inline content, known as leaf nodes.
 * @param attributes Custom fields on the leaf.
 * @param children Child leaves to be recursively rendered.
 * @param leaf The current leaf to be rendered.
 * @constructor
 */
const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = leaf.data as any;

  const style: CSS.Properties = {
    position: 'relative',
    backgroundColor: data?.alphaColor
  };

  return (
    <span {...attributes} style={style}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {leaf.isCaret ? <Caret {...(leaf as any)} /> : null}
      {children}
    </span>
  );
};

export interface DropDownMenuProps {
  onSelect: () => void;
}

const AlignBlockMenuButton: React.FC<AlignBlockMenuButtonProps> = ({
  alignment,
  icon
}) => {
  return (
    <ToggleableToolbarButton
      isActiveFunc={isAlignActive}
      toggleFunc={alignBlock}
      format={alignment}
      icon={icon}
    />
  );
};

/**
 * Toolbar button for toggling block-level formatting.
 * @param editor
 * @param format
 * @param icon
 * @constructor
 */
const BlockMenuButton: React.FC<ToolbarButtonProps> = ({ format, icon }) => {
  return (
    <ToggleableToolbarButton
      isActiveFunc={isBlockActive}
      toggleFunc={toggleBlock}
      format={format}
      icon={icon}
    />
  );
};

/**
 * Toolbar button for toggling inline, or leaf level formatting.
 * @param editor
 * @param format
 * @param icon
 * @constructor
 */
const MarkMenuButton: React.FC<ToolbarButtonProps> = ({ format, icon }) => {
  return (
    <ToggleableToolbarButton
      format={format}
      icon={icon}
      isActiveFunc={isMarkActive}
      toggleFunc={toggleMark}
    />
  );
};

const ToggleableToolbarButton: React.FC<ToggleableToolbarButtonProps> = ({
  format,
  icon,
  isActiveFunc,
  toggleFunc
}) => {
  // Use non-static version so toolbar updates as the cursor moves.
  const editor = useSlate();

  const activeHandler = useCallback(() => {
    if (isParagraphAlignment(format)) {
      return (isActiveFunc as AlignActiveFunc)(editor, format);
    }
    return (isActiveFunc as ActiveFunc)(editor, format);
  }, [editor, format, isActiveFunc]);

  const toggleHandler = useCallback(() => {
    if (isParagraphAlignment(format)) {
      return (toggleFunc as AlignToggleFunc)(editor, format);
    }
    return (toggleFunc as ToggleFunc)(editor, format);
  }, [editor, format, toggleFunc]);

  return (
    <button
      type="button"
      className={activeHandler() ? 'icon-active' : 'icon'}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault();
        toggleHandler();
      }}
    >
      <Icon name={icon} size={18} />
    </button>
  );
};
