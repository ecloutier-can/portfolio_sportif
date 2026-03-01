import { GitHubService } from './github-service.js';

export class Editor {
    constructor(data) {
        this.data = data;
        this.isAdmin = false;
        this.github = null;
        this.quillInstances = {};
        this.init();
    }

    init() {
        this.setupAdminAuth();
        this.setupEditableFields();
        this.setupSaveButton();
        this.initContentForm();
    }

    setupAdminAuth() {
        const loginBtn = document.getElementById('admin-login-btn');
        const logoutBtn = document.getElementById('admin-logout-btn');
        const saveBtn = document.getElementById('admin-save-btn');
        const addBtn = document.getElementById('admin-add-btn');

        loginBtn.onclick = async () => {
            const token = prompt("Entrez votre GitHub Personal Access Token :");
            if (token) {
                try {
                    const owner = prompt("GitHub Owner :", "ecloutier-can");
                    const repo = prompt("GitHub Repo :", "portfolio_sportif");

                    this.github = new GitHubService(owner, repo, token);
                    await this.github.getFile('data.json');

                    this.isAdmin = true;
                    document.body.classList.add('admin-mode');
                    loginBtn.style.display = 'none';
                    logoutBtn.style.display = 'block';
                    saveBtn.style.display = 'block';
                    addBtn.style.display = 'block';
                    this.updateCategoryDatalist();
                    alert("Mode Admin activé !");
                } catch (e) {
                    alert("Erreur d'authentification : " + e.message);
                }
            }
        };

        logoutBtn.onclick = () => {
            this.isAdmin = false;
            document.body.classList.remove('admin-mode');
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            saveBtn.style.display = 'none';
            addBtn.style.display = 'none';
            location.reload();
        };
    }

    initContentForm() {
        const modal = document.getElementById('add-content-modal');
        const addBtn = document.getElementById('admin-add-btn');
        const cancelBtn = document.getElementById('cancel-add');
        const form = document.getElementById('add-content-form');
        const typeSelect = document.getElementById('item-type');
        const urlInput = document.getElementById('item-url');
        const thumbInput = document.getElementById('item-thumbnail');

        addBtn.onclick = () => {
            modal.style.display = 'flex';
            this.updateCategoryDatalist();
        };

        cancelBtn.onclick = () => {
            modal.style.display = 'none';
            form.reset();
        };

        typeSelect.onchange = () => {
            if (typeSelect.value === 'youtube') {
                urlInput.placeholder = "URL YouTube (ex: https://www.youtube.com/watch?v=...)";
            } else {
                urlInput.placeholder = "Chemin local (ex: media/photos/image.jpg)";
            }
        };

        form.onsubmit = async (e) => {
            e.preventDefault();

            const newItem = {
                id: Date.now(),
                title: document.getElementById('item-title').value,
                type: typeSelect.value,
                url: urlInput.value,
                category: document.getElementById('item-category').value,
                description: document.getElementById('item-description').value,
                thumbnail: thumbInput.value
            };

            // Auto-génération de la miniature YouTube si vide
            if (newItem.type === 'youtube' && !newItem.thumbnail) {
                const videoId = this.extractYouTubeId(newItem.url);
                newItem.thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }

            this.data.items.push(newItem);

            try {
                const updatedContent = JSON.stringify(this.data, null, 2);
                await this.github.updateFile('data.json', updatedContent, `Ajout de l'extrait : ${newItem.title}`);
                alert("Extrait ajouté avec succès !");
                location.reload();
            } catch (err) {
                alert("Erreur lors de l'ajout : " + err.message);
            }
        };
    }

    updateCategoryDatalist() {
        const datalist = document.getElementById('category-list');
        const categories = [...new Set(this.data.items.map(item => item.category))];
        datalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
    }

    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    }

    setupEditableFields() {
        const fields = document.querySelectorAll('.edit-overlay');
        fields.forEach(field => {
            field.onclick = () => {
                if (!this.isAdmin) return;

                const fieldPath = field.dataset.field;
                const targetId = field.querySelector('[id]').id;

                if (this.quillInstances[fieldPath]) return; // Déjà en édition

                const container = field.querySelector(`#${targetId}`);
                const originalContent = container.innerHTML;

                // Initialiser Quill
                const quill = new Quill(container, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['clean']
                        ]
                    }
                });

                this.quillInstances[fieldPath] = quill;

                // Empêcher la propagation du click pour ne pas relancer Quill
                container.onclick = (e) => e.stopPropagation();
            };
        });
    }

    setupSaveButton() {
        const saveBtn = document.getElementById('admin-save-btn');
        saveBtn.onclick = async () => {
            if (!this.github) return;

            try {
                saveBtn.disabled = true;
                saveBtn.textContent = "Sauvegarde...";

                // Mettre à jour l'objet data avec les contenus de Quill
                for (const [path, quill] of Object.entries(this.quillInstances)) {
                    const content = quill.root.innerHTML;
                    this.setDeepValue(this.data, path, content);
                }

                const updatedContent = JSON.stringify(this.data, null, 2);
                await this.github.updateFile('data.json', updatedContent, "Mise à jour via l'éditeur web");

                alert("Sauvegardé avec succès sur GitHub !");
                location.reload();
            } catch (e) {
                alert("Erreur lors de la sauvegarde : " + e.message);
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = "Enregistrer";
            }
        };
    }

    setDeepValue(obj, path, value) {
        const parts = path.split('.');
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
    }
}
