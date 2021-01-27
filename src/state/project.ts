import { Project } from '../model/project.js';
import { LocalState } from '../model/types.js';
import { State } from './main.js';

class ProjectState extends State<Project> {
  private projects: { [type: string]: Map<string, Project> } = {};
  private static instance: ProjectState;
  private readonly localKey = '$project-state';

  private constructor() {
    super();
    this.init();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(type: string, id: string, project: Project) {
    if (!(type in this.projects)) {
      this.projects[type] = new Map();
    }
    this.invokeListeners(type, project);
    this.projects[type].set(id, project);
    this.persistState();
  }

  hasProject(type: string, id: string) {
    if (type in this.projects) {
      return this.projects[type].has(id);
    }
    return false;
  }

  removeProject(type: string, id: string) {
    if (this.projects[type].has(id)) {
      const project = this.projects[type].get(id);
      this.projects[type].delete(id);
      return project;
    } else {
      return null;
    }
  }

  private invokeListeners(type: string, project: Project) {
    for (let listener of this.listeners[type]) {
      listener([project]);
    }
  }

  private persistState() {
    const types = Object.keys(this.projects);
    const state = types.map((type) => ({
      type: type,
      projects: [...this.projects[type].entries()],
    }));
    localStorage.setItem(this.localKey, JSON.stringify(state));
  }

  private async init() {
    const retrievedData = localStorage.getItem(this.localKey);
    if (retrievedData) {
      const state = await (<Array<LocalState>>JSON.parse(retrievedData));
      if (Array.isArray(state)) {
        state.forEach(({ type, projects }) => {
          this.addProjects(type, projects);
        });
      }
    }
  }

  private addProjects(type: string, projects: Array<[string, Project]>) {
    projects.forEach(([id, project]) => {
      const newProject = new Project(
        id,
        project.title,
        project.description,
        project.numberOfPeople
      );
      this.addProject(type, id, newProject);
    });
  }
}

export const projectStore = ProjectState.getInstance();
