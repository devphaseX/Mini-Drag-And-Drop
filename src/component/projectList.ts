import { DragTarget } from '../model/drag_and_drop.js';
import { Project } from '../model/project.js';
import { Template } from './base.js';
import { autoBind } from '../decorator/autobind.js';
import { projectStore } from '../state/project.js';
import { ProjectItem } from './projectItem.js';

export class ProjectList
  extends Template<HTMLDivElement, HTMLUListElement>
  implements DragTarget {
  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app');
    this.render();
    this.connectStore();
    this.connectDraggableListeners();
  }

  private connectStore() {
    projectStore.addListener((projects: Project[]) => {
      this.renderProducts(projects);
    }, this.type);
  }

  @autoBind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const projectList = this.importElement.querySelector('ul')!;
      projectList.classList.add('droppable');
    }
  }

  @autoBind
  dragLeaveHandler(_: DragEvent) {
    const projectList = this.importElement.querySelector('ul')!;
    projectList.classList.remove('droppable');
  }

  @autoBind
  dropHandler(event: DragEvent) {
    const [id, projectType] = <[string, string]>(
      event.dataTransfer?.getData('text/plain').split('-')
    );
    if (this.type !== projectType) {
      const draggedProject = projectStore.removeProject(projectType, id);
      if (draggedProject) {
        const newProject = new Project(
          id,
          draggedProject.title,
          draggedProject.description,
          draggedProject.numberOfPeople
        );
        projectStore.addProject(this.type, id, newProject);
        const projectElement = document.getElementById(projectType.concat(id))!;
        const projectListEl = projectElement.parentElement!;
        projectListEl.removeChild(projectElement);
      }
    }
  }

  connectDraggableListeners() {
    this.importElement.addEventListener('dragover', this.dragOverHandler);
    this.importElement.addEventListener('dragleave', this.dragLeaveHandler);
    this.importElement.addEventListener('drop', this.dropHandler);
  }

  render() {
    this.importElement.id = `${this.type}-projects`;
    this.mount('beforeend', this.importElement);
    this.injectElement(this.importElement);
  }

  injectElement<S extends HTMLElement>(element: S) {
    const listId = `${this.type}-projects-list`;
    element.querySelector('ul')!.id = listId;
    element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProducts(projects: Project[]) {
    for (let project of projects) {
      new ProjectItem(
        this.importElement.id.concat('-list'),
        project,
        this.type
      );
    }
  }
}
