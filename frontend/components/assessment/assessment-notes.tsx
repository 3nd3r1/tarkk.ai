"use client"

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StickyNote, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { Badge } from '@/components/ui/badge';

interface AssessmentNotesProps {
  assessmentId: string;
}

export function AssessmentNotes({ assessmentId }: AssessmentNotesProps) {
  const { isAuthenticated, userNotes, addNote, updateNote, deleteNote } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const notes = userNotes.filter(n => n.assessmentId === assessmentId);

  const handleOpen = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    setIsOpen(true);
  };

  const handleAddNote = () => {
    setIsAdding(true);
  };

  const handleSaveNew = () => {
    if (newNoteContent.trim()) {
      addNote(assessmentId, newNoteContent);
      setNewNoteContent('');
      setIsAdding(false);
    }
  };

  const handleStartEdit = (noteId: string, content: string) => {
    setEditingNoteId(noteId);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (editingNoteId && editContent.trim()) {
      updateNote(editingNoteId, editContent);
      setEditingNoteId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="relative"
      >
        <StickyNote className="h-4 w-4 mr-2" />
        Notes
        {notes.length > 0 && (
          <Badge 
            variant="secondary" 
            className="ml-2 h-5 min-w-5 px-1.5 flex items-center justify-center text-xs"
          >
            {notes.length}
          </Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              Notes {notes.length > 0 && `(${notes.length})`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {/* Add new note form */}
            {isAdding ? (
              <Card className="p-3 border border-primary/20">
                <Textarea
                  placeholder="Write your note..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                  className="mb-2 text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveNew} className="h-7 px-2 text-xs">
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsAdding(false);
                    setNewNoteContent('');
                  }} className="h-7 px-2 text-xs">
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </Card>
            ) : (
              <Button size="sm" variant="outline" onClick={handleAddNote} className="w-full">
                <Plus className="h-3 w-3 mr-2" />
                Add Note
              </Button>
            )}

            {/* Existing notes */}
            {notes.map((note) => (
              <Card key={note.id} className="p-3 bg-muted/20">
                {editingNoteId === note.id ? (
                  <>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="mb-2 text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit} className="h-7 px-2 text-xs">
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-7 px-2 text-xs">
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm whitespace-pre-wrap flex-1 leading-relaxed">{note.content}</p>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(note.id, note.content)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNote(note.id)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {note.createdAt !== note.updatedAt ? 'Updated' : 'Created'} {formatDate(note.updatedAt)}
                    </p>
                  </>
                )}
              </Card>
            ))}

            {notes.length === 0 && !isAdding && (
              <div className="text-center py-6 text-muted-foreground">
                <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notes yet. Click "Add Note" to get started.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
