export interface ProjectInput {
  projectCode: string;
  projectName: string;
  projectDueDate: string;
  projectStatus: string;
  projectMember?: string;
  projectNote?: string;
  projectDetails?: {
    projectMember: string;
    projectNote: string;
  };
}

export interface Project extends ProjectInput {
  _id?: string;
  actions?: string;
}

