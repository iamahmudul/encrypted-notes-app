import { useEditor, Content, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import styles from './App.module.css';

type Note = {
  id: string,
  title: string,
  content: Content,
  updatedAt: Date
}

function App() {
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Write your note here...</p>',
    editorProps: {
      attributes: {
        class: styles.textEditor,
      },
    }
  })

  const toggleBold = () => editor?.chain().focus().toggleBold().run();

  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();

  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();

  const toggleH1 = () => editor?.chain().focus().toggleHeading({ level: 1 }).run();
  
  const toggleH3 = () => editor?.chain().focus().toggleHeading({ level: 3 }).run();
  
  const toggleH5 = () => editor?.chain().focus().toggleHeading({ level: 5 }).run();
  
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();

  const handleCreateNewNote = () => {
    const newNote = {
      id: uuid(),
      title: 'A new note title',
      content: '<h1>This is note content</h1>',
      updatedAt: new Date()
    };
    setNotes((notes) => ({
      ...notes,
      [newNote.id]: newNote
    }));
  }

  const handleChangeActiveNoteId = (id: string) => {
    setActiveNoteId(id);
  }

  const notesList = Object.values(notes).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  )
  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <button className={styles.sidebarButton} onClick={handleCreateNewNote}>New Note</button>
        <div className={styles.sidebarList}>
          {
            notesList.map(note => (
              <div key={note.id} 
                role="button" 
                tabIndex={0} 
                className={styles.sidebarItem}
                onChange={() => handleChangeActiveNoteId(note.id)}>{note.title}</div>
            ))
          }
        </div>
      </div>
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
    </div>
  );
}

export default App
