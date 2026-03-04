import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static values = {
        words: String,
        title: String,
        accent: String,
    };

    connect() {
        this.root = null;
        import('../js/components/WordCloud').then(({ default: WordCloud }) => {
            const React = require('react');
            const { createRoot } = require('react-dom/client');
            this.root = createRoot(this.element);

            let words = [];
            if (this.hasWordsValue) {
                try {
                    const parsed = JSON.parse(this.wordsValue);
                    if (Array.isArray(parsed)) {
                        words = parsed;
                    }
                } catch (error) {
                    words = [];
                }
            }

            this.root.render(
                React.createElement(WordCloud, {
                    title: this.hasTitleValue ? this.titleValue : 'Nuage de compétences',
                    words,
                    accent: this.hasAccentValue ? this.accentValue : '#1eead0',
                })
            );
        });
    }

    disconnect() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }
}
