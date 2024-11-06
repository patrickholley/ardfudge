import {store} from "@store";
import {ArdBudgeDatum} from "@app-types/store";
import ardRender from "@utils/ardRender";
import pascalToSnake from "@utils/pascalToSnake";

const componentTag = 'form-modal';

class FormModal extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        this.formName = this.getAttribute('formName') || '';
        this.legend = this.getAttribute('legend') || '';
        ardRender(this);
    }

    toggleOpen = (shouldBeOpen: boolean) => {
        const formModal = this.shadowRoot?.querySelector('#modal-container') as HTMLElement;
        if (formModal) formModal.style.display = shouldBeOpen ? 'block' : 'none';
    }

    async getFieldset() {
        if (this.formName) {
            const templateString = await (await fetch(`/src/templates/${pascalToSnake(this.formName || '')}.html`)).text();
            const fieldset = this.shadowRoot?.querySelector('#form-fieldset') as HTMLElement;
            fieldset.innerHTML = templateString;
        }
    }

    checkFormValidity = () => {
        const isFormValid = Array.from(
            new FormData(this.shadowRoot?.querySelector('form') as HTMLFormElement
        ).values()).every(value => value);

        const submitButton = this.shadowRoot?.querySelector('#button__submit') as HTMLButtonElement;
        if (submitButton) submitButton.disabled = !isFormValid;
    }

    onSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const formEntries = Object.fromEntries(
            new FormData(e.target as HTMLFormElement).entries()
        ) as unknown as ArdBudgeDatum;

        formEntries.cost = parseFloat(formEntries.cost).toFixed(2);

        store.addRow(
            'MyFirstBudge',
            formEntries
        );

        this.toggleOpen(false);
    }

    async onRender() {
        store.incrementLoadingCount();

        await this.getFieldset();
        document.addEventListener('open-form', () => this.toggleOpen(true));

        this.shadowRoot?.querySelector('form')?.addEventListener('submit', this.onSubmit);
        this.shadowRoot?.querySelector('#button__cancel')
            ?.addEventListener('click', () => this.toggleOpen(false));
        this.shadowRoot?.querySelectorAll('input')
            ?.forEach(input => input.addEventListener('input', this.checkFormValidity));

        store.decrementLoadingCount();
    }
}

customElements.define(componentTag, FormModal);