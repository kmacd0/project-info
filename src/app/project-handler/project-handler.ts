import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Project, ProjectInput } from '../project';
import { ProjectApi } from '../project-api';

@Component({
  imports: [ReactiveFormsModule, FormsModule],
  selector: 'app-progress-notes',
  styleUrl: './project-handler.css',
  templateUrl: './project-handler.html',
})
export class ProgressNotes implements OnInit {
  // Access Angular services
  private projectApi = inject(ProjectApi);
  private cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = [
    'Project Code',
    'Project Name',
    'Due Date',
    'Status',
    'Member',
    'Notes',
    'Actions',
  ];

  // Store projects retrieved from MongoDB
  createdProjects: Project[] = [];

  // Define the reactive form
  progressNotesForm = new FormGroup({
    projectCode: new FormControl(''),
    projectName: new FormControl(''),
    projectDueDate: new FormControl(''),
    projectStatus: new FormControl(''),

    projectDetails: new FormGroup({
      projectMember: new FormControl(''),
      projectNote: new FormControl(''),
    }),
  });

  projectCodeNotFound = false;

  codeMap = new Map<string, string>([
    ['PPT101', 'Project Progress Tracker'],
    ['WEB202', 'Website Redesign'],
    ['APP303', 'Mobile Application Development'],
    ['DATA404', 'Data Analytics Dashboard'],
  ]);

  // Load project information on initialization
  ngOnInit(): void {
    this.loadProjects();
  }

  // GET: Retrieve all projects
  loadProjects(): void {
    this.projectApi.getProjects().subscribe({
      next: (data) => {
        this.createdProjects = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading projects from MongoDB:', err);
      },
    });
  }

  updateProjectName(): void {
    const enteredCode: string | null = this.progressNotesForm.controls.projectCode.value;

    if (enteredCode !== null && enteredCode.trim() !== '') {
      const formattedCode: string = enteredCode.trim().toUpperCase();

      if (this.codeMap.has(formattedCode)) {
        const matchedProjectName: string | undefined = this.codeMap.get(formattedCode);

        if (matchedProjectName !== undefined) {
          this.progressNotesForm.controls.projectName.setValue(matchedProjectName);
        }
        this.projectCodeNotFound = false;
      } else {
        this.progressNotesForm.controls.projectName.setValue('');
        this.projectCodeNotFound = true;
      }
    } else {
      this.progressNotesForm.controls.projectName.setValue('');
      this.projectCodeNotFound = false;
    }
  }

  // POST: Create a new project
  onSubmit(): void {
    const formData = this.progressNotesForm.value;
    console.log('Received Project Form Data:', formData);

    let memberValue = '';
    let noteValue = '';

    if (formData.projectDetails !== null && formData.projectDetails !== undefined) {
      if (
        formData.projectDetails.projectMember !== null &&
        formData.projectDetails.projectMember !== undefined
      ) {
        memberValue = formData.projectDetails.projectMember;
      }
      if (
        formData.projectDetails.projectNote !== null &&
        formData.projectDetails.projectNote !== undefined
      ) {
        noteValue = formData.projectDetails.projectNote;
      }
    }

    const newRecord: ProjectInput = {
      projectCode: formData.projectCode || '',
      projectName: formData.projectName || '',
      projectDueDate: formData.projectDueDate || '',
      projectStatus: formData.projectStatus || '',
      projectMember: memberValue,
      projectNote: noteValue,
    };

    this.projectApi.addProject(newRecord).subscribe({
      next: (savedProject) => {
        console.log('Project saved to MongoDB:', savedProject);
        this.createdProjects = [...this.createdProjects, savedProject];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error saving project to MongoDB:', err);
      },
    });
  }

  // DELETE: Remove a project
  deleteProject(index: number): void {
    const projectToDelete = this.createdProjects[index];

    if (projectToDelete && projectToDelete._id) {
      this.projectApi.deleteProject(projectToDelete._id).subscribe({
        next: () => {
          console.log('Deleted from MongoDB:', projectToDelete._id);
          this.createdProjects = this.createdProjects.filter((p) => p._id !== projectToDelete._id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error deleting from MongoDB:', err);
        },
      });
    }
  }

  // PUT: Update an existing project
  saveProjectUpdate(project: Project): void {
    if (project && project._id) {
      this.projectApi.updateProject(project._id, project).subscribe({
        next: (updated) => {
          console.log('Project updated in MongoDB:', updated);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating project in MongoDB:', err);
        },
      });
    }
  }
}
