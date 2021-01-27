import { Draggable } from '../model/drag_and_drop.js';
import { Project } from '../model/project.js';
import { Template } from './base.js';
import { autoBind } from '../decorator/autobind.js';

export class ProjectItem
  extends Template<HTMLUListElement, HTMLOListElement>
  implements Draggable {
  private project: Project;
  private removeMount?: Function;

  get persons() {
    return `${this.project.numberOfPeople} person${
      this.project.numberOfPeople === 1 ? '' : 's'
    } assigned `;
  }

  constructor(
    hostId: string,
    project: Project,
    public type: 'active' | 'finished'
  ) {
    super('single-project', hostId);
    this.project = project;
    this.connectId(project);
    this.render();
  }

  enableDraggable() {
    this.importElement.addEventListener('dragstart', this.dragStartHandler);
    this.importElement.addEventListener('dragend', this.dragEndHandler);
  }

  @autoBind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData(
      'text/plain',
      `${this.project.id}-${this.type}`
    );
    event.dataTransfer!.effectAllowed = 'move';
  }

  @autoBind
  dragEndHandler(_: DragEvent) {
    this.removeMount && this.removeMount(this.type, this.project.id);
  }

  connectMountStore(unMount: Function) {
    this.removeMount = unMount;
  }

  private connectId(project: Project) {
    this.importElement.id = this.type.concat(project.id);
  }

  render() {
    const titleLabelEl = this.importElement.querySelector('h2')!;
    const personsLabelEl = titleLabelEl.nextElementSibling!;
    const descriptionLabelEl = personsLabelEl.nextElementSibling!;
    titleLabelEl.textContent = this.project.title;
    personsLabelEl.textContent = this.persons;
    descriptionLabelEl.textContent = this.project.description;
    this.hostElement.insertAdjacentElement('beforeend', this.importElement);
    this.enableDraggable();
  }
}
