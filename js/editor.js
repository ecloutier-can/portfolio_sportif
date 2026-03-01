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

    showLoading(text) {
        const overlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');
        overlay.style.display = 'flex';
        loadingText.textContent = text || "Traitement en cours...";
    }

    hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
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
                    // Récupérer les données les plus fraîches depuis GitHub
                    const remoteData = await this.github.getFile('data.json');
                    this.data = JSON.parse(decodeURIComponent(escape(atob(remoteData.content))));

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

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }

    initContentForm() {
        const modal = document.getElementById('add-content-modal');
        const addBtn = document.getElementById('admin-add-btn');
        const cancelBtn = document.getElementById('cancel-add');
        const form = document.getElementById('add-content-form');
        const typeSelect = document.getElementById('item-type');
        const urlInput = document.getElementById('item-url');
        const fileInput = document.getElementById('item-file');
        const thumbInput = document.getElementById('item-thumbnail');
        const thumbFileInput = document.getElementById('item-thumb-file');

        addBtn.onclick = () => {
            modal.style.display = 'flex';
            this.updateCategoryDatalist();
        };

        cancelBtn.onclick = () => {
            modal.style.display = 'none';
            form.reset();
        };

        // Suggestion de chemin local quand on choisit un fichier
        fileInput.onchange = () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const folder = typeSelect.value === 'video' ? 'videos' : 'photos';
                const folderCategory = document.getElementById('item-category').value.toLowerCase() || 'general';
                urlInput.value = `media/${folder}/${folderCategory}/${file.name}`;
            }
        };

        form.onsubmit = async (e) => {
            e.preventDefault();
            this.showLoading("Préparation de l'extrait...");

            try {
                const title = document.getElementById('item-title').value;
                const type = typeSelect.value;
                const category = document.getElementById('item-category').value;
                const tags = document.getElementById('item-tags').value.split(',').map(t => t.trim()).filter(t => t);
                const description = document.getElementById('item-description').value;
                let finalUrl = urlInput.value;
                let finalThumb = thumbInput.value;

                // 1. Upload du fichier principal si présent
                if (fileInput.files.length > 0) {
                    this.showLoading(`Upload du média : ${fileInput.files[0].name}...`);
                    const base64 = await this.fileToBase64(fileInput.files[0]);
                    await this.github.updateFile(finalUrl, base64, `Upload média : ${title}`, true);
                }

                // 2. Upload de la miniature si présente
                if (thumbFileInput.files.length > 0) {
                    this.showLoading(`Upload de la miniature...`);
                    const thumbBase64 = await this.fileToBase64(thumbFileInput.files[0]);
                    if (!finalThumb) finalThumb = `media/thumbnails/${thumbFileInput.files[0].name}`;
                    await this.github.updateFile(finalThumb, thumbBase64, `Upload miniature : ${title}`, true);
                }

                // 3. Auto-miniature YouTube
                if (type === 'youtube' && !finalThumb) {
                    const videoId = this.extractYouTubeId(finalUrl);
                    finalThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }

                const newItem = {
                    id: Date.now(),
                    title,
                    type,
                    url: finalUrl,
                    category,
                    tags,
                    description,
                    thumbnail: finalThumb || 'media/thumbnails/default.jpg'
                };

                this.data.items.push(newItem);

                this.showLoading("Mise à jour de data.json...");
                const updatedContent = JSON.stringify(this.data, null, 2);
                await this.github.updateFile('data.json', updatedContent, `Ajout extrait : ${title}`);

                this.hideLoading();
                alert("Ajouté avec succès !");
                location.reload();
            } catch (err) {
                this.hideLoading();
                alert("Erreur : " + err.message);
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
                if (this.quillInstances[fieldPath]) return;

                const container = field.querySelector(`#${targetId}`);
                const quill = new Quill(container, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            ['bold', 'italic'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['clean']
                        ]
                    }
                });
                this.quillInstances[fieldPath] = quill;
                container.onclick = (e) => e.stopPropagation();
            };
        });
    }

    setupSaveButton() {
        const saveBtn = document.getElementById('admin-save-btn');
        saveBtn.onclick = async () => {
            if (!this.github) return;
            this.showLoading("Sauvegarde en cours...");

            try {
                // Sync Quill
                for (const [path, quill] of Object.entries(this.quillInstances)) {
                    const content = quill.root.innerHTML;
                    this.setDeepValue(this.data, path, content);
                }

                const updatedContent = JSON.stringify(this.data, null, 2);
                await this.github.updateFile('data.json', updatedContent, "Mise à jour athlète");

                this.hideLoading();
                alert("Sauvegardé avec succès !");
                location.reload();
            } catch (e) {
                this.hideLoading();
                alert("Erreur : " + e.message);
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
