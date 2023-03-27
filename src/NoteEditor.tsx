import { EditorContent, JSONContent, useEditor, generateText } from "@tiptap/react";
import { Note } from "./types";
import StarterKit from "@tiptap/starter-kit";
import styles from "./NoteEditor.module.css";

const extensions = [StarterKit];

type Props = {
    note: Note,
    onChange: (content: JSONContent, title?: string) => void
}

function NodeEditor ({ note, onChange } : Props) {
    const editor = useEditor(
        {
            extensions,
            content: note.content,
            editorProps: {
                attributes: {
                class: styles.textEditor,
                },
            },
            onUpdate: ({ editor }) => {
                const editorContent = editor.getJSON();
                const firstNodeContent = editorContent.content?.[0];
                onChange(editorContent, firstNodeContent && generateText(firstNodeContent, extensions));
            }
        }, 
        [note.id]
    )

    const toggleBold = () => editor?.chain().focus().toggleBold().run();
  
    const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  
    const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  
    const toggleH1 = () => editor?.chain().focus().toggleHeading({ level: 1 }).run();
    
    const toggleH3 = () => editor?.chain().focus().toggleHeading({ level: 3 }).run();
    
    const toggleH5 = () => editor?.chain().focus().toggleHeading({ level: 5 }).run();
    
    const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
    
    const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();

    return (
        <div className={styles.editorContainer}>
        <div className={styles.toolbar}>
          <button 
            className={
              editor?.isActive('bold') 
                ? styles.toolbarButtonActive 
                : styles.toolbarButton
            }
            onClick={toggleBold}
            >Bold</button>

          <button
            className={
              editor?.isActive('italic') 
                ? styles.toolbarButtonActive 
                : styles.toolbarButton
            }
            onClick={toggleItalic}>Italic</button>
          
          <button
            className={
              editor?.isActive('strike') 
                ? styles.toolbarButtonActive 
                : styles.toolbarButton
            }
            onClick={toggleStrike}>Strike</button>
          
          <button
            className={
              editor?.isActive('heading', { level: 1 }) 
                ? styles.toolbarButtonActive 
                : styles.toolbarButton
            }
            onClick={toggleH1}>H1</button>
          
          <button
            className={
              editor?.isActive('heading', { level: 3 }) 
                ? styles.toolbarButtonActive 
                : styles.toolbarButton
            }
            onClick={toggleH3}>H3</button>
          
          <button
            className={
              editor?.isActive('heading', { level: 5 }) 
                ? styles.toolbarButtonActive 
                : styles.toolbarButton
            }
            onClick={toggleH5}>H5</button>
        
          <button
            className={
              editor?.isActive('bulletList', { level: 5 }) 
                ? styles.toolbarButtonActive 
                : styles.toolbarButton
            }
            onClick={toggleBulletList}>Bullet list</button>
          
          <button
            className={
              editor?.isActive('orderedList', { level: 5 }) 
                ? styles.toolbarButtonActive 
                : styles.toolbarButton
            }
            onClick={toggleOrderedList}>Ordered list</button>
        </div>
        <EditorContent editor={editor} className={styles.textEditorComponent} />
      </div>
    );
}

export default NodeEditor;