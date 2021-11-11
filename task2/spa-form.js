class fNode {
  constructor(value, prev, next) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

class fNodeList {
  constructor(...values) {
    this.head = null;
    this.tail = null;

    values.forEach((v) => this.append(v));
  }

  append(val) {

    const node = new fNode(val);

    if (!this.head) {
      this.head = node;
      this.head.next = node;
      this.current = this.head;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      node.next = this.head;
    }

    this.head.prev = node;
    this.tail = node;

    return this;
  }

  previous() {
    this.current = this.current.prev;
    return this;
  };

  next() {
    this.current = this.current.next;
    return this;
  };

  last() {
    this.current = this.getLast();
    return this;
  }

  setCurrent(value) {
    this.current = value;
    return this;
  }

  getFirst() {
    return this.head;
  }

  getLast() {
    return this.tail;
  }

  getPrevLast() {
    return this.tail.prev;
  }

  iterate(func) {
    let current = this.head;
    let cond = null;
    let i = 0;
    while (current !== cond) {
      func(current, i++);
      current = current.next;
      cond = this.head;
    }
  }

  toArray() {
    const arr = [];
    this.iterate((t) => arr.push(t));
    return arr;
  }

  toString() {
    return this.toArray().map(t => t.value).join(' <==> ');
  }
}

class Input {
  static inputInvalidCLName = 'main-form__input_invalid';

  constructor(elem) {
    this.elem = elem;
  }

  setInvalid(value) {
    this.elem.classList.toggle(Input.inputInvalidCLName, true);
  }
}

class TextInput extends Input {

  constructor(elem) {
    super(elem);
  }

  validate() {
    this.setInvalid(false);
    const test = /\S+/.test(this.elem.value);
    this.setInvalid(!test);
    return test;
  }
}

class EmailInput extends Input {

  constructor(elem) {
    super(elem);
  }
  
  validate() {
    this.setInvalid(false);
    const test = /\w+@\w+\.\w+/i.test(this.elem.value);
    this.setInvalid(!test);
    return test;
  }
}

class SPAForm {
  static stepQuery = '[data-type="step"]';
  static currentCLName = 'client-info__step_current';
  static disabledCLName = 'btn_disabled';
  static stepHeaderCLName = 'client-info__header';
  static nextbtnQuery = '[data-type="next"]';
  static prevbtnQuery = '[data-type="prev"]';
  static endbtnQuery = '[data-type="end"]';
  static validatableQuery = '[data-validate="true"]';

  constructor(htmlElement) {
    this.root = htmlElement;
    this.steps = new fNodeList(...this.root.querySelectorAll(SPAForm.stepQuery));
    this.steps.iterate((t, i) => {
      this.resetCurrentElement(t.value, SPAForm.currentCLName);
      this.addHeader(t, i);
    });

    this.nextBtn = this.root.querySelector(SPAForm.nextbtnQuery);
    this.nextBtn.onclick = () => this.changeStep(() => this.steps.next());
    this.prevBtn = this.root.querySelector(SPAForm.prevbtnQuery);
    this.prevBtn.onclick = () => this.changeStep(() => this.steps.previous());
    this.endBtn = this.root.querySelector(SPAForm.endbtnQuery);
    this.endBtn.onclick = () => this.changeStep(() => {
      const result = this.validate();
      if (result.valid) {
        this.steps.last();
      } else {
        const invalidInputs = result.inputs.filter((t) => !t.status).map((t) => t.elem);
        const step = this.steps.toArray().find((t) => invalidInputs.some((i) => t.value.contains(i)));
        this.changeStep(() => this.steps.setCurrent(step));
      }
    });

    this.validatables = [...this.root.querySelectorAll(SPAForm.validatableQuery)].map((t) => {
      if (t.dataset.type === 'text') return new TextInput(t);
      if (t.dataset.type === 'email') return new EmailInput(t);
    });

    this.setCurrentElement(this.steps.current.value, SPAForm.currentCLName);
    this.updateControllerState();
  }

  addHeader(step, index) {
    let elem = document.createElement('h1');
    elem.classList.toggle(SPAForm.stepHeaderCLName, true);
    if (step !== this.steps.getLast()) {
      elem.innerText = `Шаг ${index + 1}.`;
    } else {
      elem.innerText = `Конец`;
    }
    step.value.insertBefore(elem, step.value.firstChild);
  }

  resetCurrentElement(step, className) {
    step.classList.toggle(className, false);
  }

  setCurrentElement(step, className) {
    step.classList.toggle(className, true);
  }

  changeStep(stepFunc) {
    this.resetCurrentElement(this.steps.current.value, SPAForm.currentCLName);
    stepFunc();
    this.setCurrentElement(this.steps.current.value, SPAForm.currentCLName);
    this.updateControllerState();
  }

  validate() {
    const inputs = this.validatables.map((t) => {
      let status = t.validate();
      return { elem: t.elem, status };
    });
    const valid = !inputs.some((t) => !t.status);
    return { inputs, valid };
  }

  //don't look at this ugly function
  updateControllerState() {
    this.resetCurrentElement(this.prevBtn, SPAForm.disabledCLName);
    this.resetCurrentElement(this.nextBtn, SPAForm.disabledCLName);
    this.resetCurrentElement(this.endBtn, SPAForm.disabledCLName);
    switch (this.steps.current) {
      case this.steps.getFirst():
        this.setCurrentElement(this.prevBtn, SPAForm.disabledCLName);
        this.setCurrentElement(this.endBtn, SPAForm.disabledCLName);
        break;
      case this.steps.getPrevLast():
        this.resetCurrentElement(this.endBtn, SPAForm.disabledCLName);
        this.setCurrentElement(this.nextBtn, SPAForm.disabledCLName);
        break;
      case this.steps.getLast():
        this.setCurrentElement(this.prevBtn, SPAForm.disabledCLName);
        this.setCurrentElement(this.nextBtn, SPAForm.disabledCLName);
        this.setCurrentElement(this.endBtn, SPAForm.disabledCLName);
        break;
      default:
        this.resetCurrentElement(this.prevBtn, SPAForm.disabledCLName);
        this.resetCurrentElement(this.nextBtn, SPAForm.disabledCLName);
        this.setCurrentElement(this.endBtn, SPAForm.disabledCLName);
        break;
    }
  }
}
const spaForm = new SPAForm(document.querySelector('[data-type="step-form"]'));