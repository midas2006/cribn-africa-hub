
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, FileText, Scan } from 'lucide-react';
import { useCreateNote } from '../hooks/useNotes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateNoteDialog: React.FC<CreateNoteDialogProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<'method' | 'form'>('method');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    course_name: '',
    department: '',
    semester: '',
    topic: '',
    caption: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const createNoteMutation = useCreateNote();
  const { toast } = useToast();

  const departments = [
    'Computer Science',
    'Engineering',
    'Business',
    'Medicine',
    'Arts',
    'Science',
    'Law',
    'Education',
  ];

  const semesters = [
    'Fall 2024',
    'Spring 2024',
    'Summer 2024',
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester',
  ];

  const handleFileUpload = async (file: File, type: 'image' | 'pdf') => {
    if (!file) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('notes')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('notes')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = null;
      let pdfUrl = null;

      if (imageFile) {
        imageUrl = await handleFileUpload(imageFile, 'image');
      }

      if (pdfFile) {
        pdfUrl = await handleFileUpload(pdfFile, 'pdf');
      }

      await createNoteMutation.mutateAsync({
        ...formData,
        image_url: imageUrl,
        pdf_url: pdfUrl,
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        course_name: '',
        department: '',
        semester: '',
        topic: '',
        caption: '',
      });
      setImageFile(null);
      setPdfFile(null);
      setStep('method');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'scan') {
      toast({
        title: "OCR Feature",
        description: "OCR scanning will be available in the next update. Please use photo upload for now.",
      });
      return;
    }
    setStep('form');
  };

  const resetDialog = () => {
    setStep('method');
    setFormData({
      title: '',
      content: '',
      course_name: '',
      department: '',
      semester: '',
      topic: '',
      caption: '',
    });
    setImageFile(null);
    setPdfFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetDialog();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'method' ? 'Create New Note' : 'Note Details'}
          </DialogTitle>
        </DialogHeader>

        {step === 'method' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <Button
              variant="outline"
              className="h-24 flex flex-col space-y-2"
              onClick={() => handleMethodSelect('scan')}
            >
              <Scan className="h-8 w-8" />
              <span>Scan Notes</span>
              <span className="text-xs text-muted-foreground">Use OCR</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col space-y-2"
              onClick={() => handleMethodSelect('photo')}
            >
              <Camera className="h-8 w-8" />
              <span>Take Photo</span>
              <span className="text-xs text-muted-foreground">Upload image</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col space-y-2"
              onClick={() => handleMethodSelect('manual')}
            >
              <FileText className="h-8 w-8" />
              <span>Manual Entry</span>
              <span className="text-xs text-muted-foreground">Type content</span>
            </Button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Calculus Integration Notes"
                  required
                />
              </div>

              <div>
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Integration by Parts"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="course_name">Course *</Label>
                <Input
                  id="course_name"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  placeholder="e.g., MATH 202"
                  required
                />
              </div>

              <div>
                <Label htmlFor="semester">Semester *</Label>
                <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>
                        {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Add any text content or notes..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption/Tip</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="e.g., These will help for the ECO202 test"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <Label htmlFor="pdf">Upload PDF</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setStep('method')}>
                Back
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Creating...' : 'Create Note'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
