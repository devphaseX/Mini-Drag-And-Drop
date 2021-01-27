import { Project } from '../model/project.js';
import { Template } from './base.js';
import { autoBind } from '../decorator/autobind.js';
import { projectStore } from '../state/project.js';
import { Valid } from '../model/valid.js';
import { validate } from '../util/validate.js';

const ACCEPTED_FORM_TYPE: ReadonlyArray<string> = [
  'title',
  'description',
  'people',
];

export class ProjectInput extends Template<HTMLDivElement, HTMLFormElement> {
  private inputElements = new Set<HTMLInputElement>();
  constructor() {
    super('project-input', 'app');
    this.render();

    for (let type of ACCEPTED_FORM_TYPE) {
      this.inputElements.add(
        <HTMLInputElement>this.hostElement.querySelector('#' + type)!
      );
    }
  }

  render() {
    this.registerEvent('submit', this.importElement, this.submitHandler);
    this.mount('afterbegin', this.importElement);
  }

  private getUserInputsValue(): [string, string, number] | void {
    const [title, description, price] = Array.from(
      this.inputElements,
      (element) => element.value
    );

    const validTitle: Valid = { value: title, required: true, minLength: 5 };
    const validDescription: Valid = {
      value: description,
      required: true,
      minLength: 5,
      badWords: true,
    };
    const validPrice: Valid = { value: +price, required: true, min: 1 };

    if ([validTitle, validPrice, validDescription].every(validate)) {
      return [title, description, +price];
    } else {
      alert('Invalid input, pls try again!!!');
    }
  }

  private clearField() {
    this.inputElements.forEach((inputElement) => {
      inputElement.value = '';
    });
  }

  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const inputValues = this.getUserInputsValue();
    if (inputValues) {
      const [title, description, numberOfPeople] = inputValues;
      const id = Math.random().toString().substr(2, 6);
      const project = new Project(id, title, description, numberOfPeople);
      projectStore.addProject('active', project.id, project);
    }
    this.clearField();
  }
}
