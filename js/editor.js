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
    }

    setupAdminAuth() {
        const loginBtn = document.getElementById('admin-login-btn');
        const logoutBtn = document.getElementById('admin-logout-btn');
        const saveBtn = document.getElementById('admin-save-btn');

        loginBtn.onclick = async () => {
            const token = prompt("Entrez votre GitHub Personal Access Token :");
            if (token) {
                try {
                    // Pour cet exemple, on demande aussi le owner/repo
                    // Dans un vrai projet, on pourrait le hardcoder ou le détecter
                    const owner = prompt("GitHub Owner (ex: ecloutier-can) :", "ecloutier-can");
                    const repo = prompt("GitHub Repo (ex: portfolio_sportif) :", "portfolio_sportif");

                    this.github = new GitHubService(owner, repo, token);
                    // Vérifier si le token est valide en tentant de lire data.json
                    await this.github.getFile('data.json');

                    this.isAdmin = true;
                    document.body.classList.add('admin-mode');
                    loginBtn.style.display = 'none';
                    logoutBtn.style.display = 'block';
                    saveBtn.style.display = 'block';
                    alert("Mode Admin activé !");
                } catch (e) {
                    alert("Erreur d'authentification ou accès au dépôt impossible : " + e.message);
                }
            }
        };

        logoutBtn.onclick = () => {
            this.isAdmin = false;
            document.body.classList.remove('admin-mode');
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            saveBtn.style.display = 'none';
            // Détruire les instances Quill si nécessaire
            location.reload();
        };
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
