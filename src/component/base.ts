import { ElementPosition } from '../model/types.js';

//Template
export abstract class Template<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  importElement: U;

  constructor(templateId: string, hostId: string) {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById(templateId)!
    );
    this.hostElement = <T>document.getElementById(hostId);
    this.importElement = <U>(
      document.importNode(this.templateElement.content, true).firstElementChild
    );
  }

  protected registerEvent<U extends Element>(type: any, node: U, cb: Function) {
    node.addEventListener(type, cb.bind(this));
  }

  protected mount<N extends Element>(where: ElementPosition, node: N) {
    this.hostElement.insertAdjacentElement(where, node);
  }

  abstract render(): void;
}
