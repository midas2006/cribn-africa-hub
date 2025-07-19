
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import NotesFilter from '../components/NotesFilter';
import NoteCard from '../components/NoteCard';
import CreateNoteDialog from '../components/CreateNoteDialog';

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: notes, isLoading, error } = useNotes(searchTerm, department, course);

  const sortedNotes = notes ? [...notes].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes_count - a.likes_count;
      case 'points':
        return b.points_count - a.points_count;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  }) : [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notes</h1>
            <p className="text-muted-foreground">Discover and share study materials with your peers</p>
          </div>
        </div>

        <div className="mb-6">
          <NotesFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            department={department}
            setDepartment={setDepartment}
            course={course}
            setCourse={setCourse}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Loading notes...</div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500">Error loading notes. Please try again.</div>
          </div>
        )}

        {sortedNotes && sortedNotes.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground mb-4">
              {searchTerm || department || course 
                ? 'No notes found matching your filters.' 
                : 'No notes available yet.'}
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Note
            </Button>
          </div>
        )}

        {sortedNotes && sortedNotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>

        <CreateNoteDialog 
          open={showCreateDialog} 
          onOpenChange={setShowCreateDialog} 
        />
      </div>
    </Layout>
  );
};

export default Notes;
