import ardRender from "@utils/ardRender";
import {store} from "@store";

const componentTag = "landing-page";

class LandingPage extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        ardRender(this);
    }

    openForm = () => {
        const openFormEvent = new CustomEvent('open-form', {
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(openFormEvent);
    }

    onFormSubmit = (formData: FormData) => {
        const name = formData.get('name');

        if (typeof name === 'string') store.addBudget(name);
        this.renderBudgetList();
    }

    renderBudgetList() {
        const budgetList = this.shadowRoot?.getElementById('budget-list');
        if (budgetList) {
            budgetList.innerHTML = '';
            const budgets = store.getBudgets();

            budgets.forEach((budget) => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');

                link.href = `/budget/${budget.id}`;
                link.textContent = budget.name;

                listItem.appendChild(link);
                budgetList.appendChild(listItem);
            });
        }
    }

    onRender() {
        this.shadowRoot?.getElementById('create-budget')?.addEventListener('click', this.openForm);
        document.addEventListener('submit-form', e => this.onFormSubmit((e as CustomEvent).detail));
        this.renderBudgetList();
    }
}

customElements.define(componentTag, LandingPage);
