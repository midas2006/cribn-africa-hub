
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, FileImage, FileText, Calendar, User } from 'lucide-react';
import { Note, useLikeNote, useGivePoints } from '../hooks/useNotes';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showPointsDialog, setShowPointsDialog] = useState(false);
  
  const likeMutation = useLikeNote();
  const pointsMutation = useGivePoints();

  const handleLike = () => {
    likeMutation.mutate({ noteId: note.id, isLiked });
    setIsLiked(!isLiked);
  };

  const handleGivePoints = (points: number) => {
    pointsMutation.mutate({ noteId: note.id, points });
    setShowPointsDialog(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-1">{note.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {note.department}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {note.course_name}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {note.semester}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(note.created_at), 'MMM dd')}</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Topic:</span> {note.topic}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {note.image_url && (
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <img
              src={note.image_url}
              alt={note.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge className="bg-background/80 text-foreground">
                <FileImage className="h-3 w-3 mr-1" />
                Image
              </Badge>
            </div>
          </div>
        )}

        {note.pdf_url && (
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">PDF Document</span>
            <Button variant="outline" size="sm" asChild>
              <a href={note.pdf_url} target="_blank" rel="noopener noreferrer">
                View
              </a>
            </Button>
          </div>
        )}

        {note.content && (
          <div className="text-sm text-card-foreground bg-muted/50 p-3 rounded-lg">
            {note.content}
          </div>
        )}

        {note.caption && (
          <div className="text-sm text-muted-foreground italic border-l-2 border-accent pl-3">
            💡 {note.caption}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{note.likes_count}</span>
            </Button>

            <div className="flex items-center space-x-1 text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{note.points_count}</span>
            </div>
          </div>

          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((points) => (
              <Button
                key={points}
                variant="outline"
                size="sm"
                onClick={() => handleGivePoints(points)}
                className="px-2 py-1 text-xs hover:bg-accent"
              >
                {points}★
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
