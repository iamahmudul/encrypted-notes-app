import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import styles from './App.module.css';
import { Note } from './types';
import NoteEditor from './NoteEditor';
import storage from './storage';
import { JSONContent } from '@tiptap/react';
import debounce from './debounce';

const STORAGE_KEY = 'notes';

const loadNotes = () => {
  const noteIds = storage.get<string[]>(STORAGE_KEY, []);
  const notes: Record<string, Note> = {};
  
  noteIds.forEach(id => {
    const note = storage.get<Note>(`${STORAGE_KEY}:${id}`);
    notes[note.id] = {
      ...note,
      updatedAt: new Date(note.updatedAt)
    }
  })

  return notes;
}

const saveNote = debounce((note: Note) => {
  const noteIds = storage.get<string[]>(STORAGE_KEY, []);
  const noteIdsWithNote = noteIds.filter(id => id !== note.id);
  storage.set(STORAGE_KEY, [...noteIdsWithNote, note.id]);
  storage.set(`${STORAGE_KEY}:${note.id}`, note);
}, 300);

function App() {
  const [notes, setNotes] = useState<Record<string, Note>>(() => loadNotes());
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const activeNote = activeNoteId ? notes[activeNoteId] : null;

  const handleCreateNewNote = () => {
    const newNote = {
      id: uuid(),
      title: 'New Note',
      content: '<h1>This is note content</h1>',
      updatedAt: new Date()
    };
    setNotes((notes) => ({
      ...notes,
      [newNote.id]: newNote
    }));
    setActiveNoteId(newNote.id);
    saveNote(newNote)
  }

  const handleChangeActiveNoteId = (id: string) => {
    setActiveNoteId(id);
    console.log(id)
  }

  const handleChangeNoteContent = (activeNoteId: string, content: JSONContent, title: string = "New Note") => {
    const updatedNote = {
      ...notes[activeNoteId],
      updatedAt: new Date(),
      content,
      title
    };
    setNotes((notes) => ({
      ...notes,
      [activeNoteId]: updatedNote
    }));
    saveNote(updatedNote);
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
                className={
                  note.id === activeNoteId ? 
                  styles.sidebarItemActive : 
                  styles.sidebarItem
                }
                onClick={() => handleChangeActiveNoteId(note.id)}>
                {note.title}
                <div className={styles.noteUpdateTime}>{note.updatedAt.toISOString().substring(0, 19).replace('T', ' ')}</div>
              </div>
            ))
          }
        </div>
      </div>
      {
        activeNote ? (
          <NoteEditor note={activeNote} onChange={(content, title) => handleChangeNoteContent(activeNote.id, content, title)} />
        ) : (
          <div>Create a new note or select an existing one</div>
        )
      }
    </div>
  );
}

export default App
