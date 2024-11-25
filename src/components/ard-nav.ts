import {lightRender} from "@utils/ardRender";
import {store} from "@store";

const componentTag = 'ard-nav';

class ArdNav extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        lightRender(this);
    }

    handleSignOut = () => {
        store.signOut();
    }

    onRender() {
        const signOutButton = this.shadowRoot?.getElementById('sign-out') as HTMLButtonElement;
        signOutButton.addEventListener('click', this.handleSignOut);
    }
}

customElements.define(componentTag, ArdNav);