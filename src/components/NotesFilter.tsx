
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface NotesFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  department: string;
  setDepartment: (dept: string) => void;
  course: string;
  setCourse: (course: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const NotesFilter: React.FC<NotesFilterProps> = ({
  searchTerm,
  setSearchTerm,
  department,
  setDepartment,
  course,
  setCourse,
  sortBy,
  setSortBy,
}) => {
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

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border border-border">
      <div className="flex items-center space-x-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4" />
        <span>Filter & Search</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Course name (e.g., CS101)"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="points">Highest Points</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default NotesFilter;
