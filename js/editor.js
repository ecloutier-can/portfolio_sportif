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
        this.setupProfilePic();
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

                // 1. Détermination de la miniature automatique (YouTube)
                if (type === 'youtube' && !finalThumb) {
                    const videoId = this.extractYouTubeId(finalUrl);
                    if (videoId) {
                        finalThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    }
                }

                // 2. Fallback miniature si vide
                if (!finalThumb) {
                    finalThumb = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop';
                }

                const newItem = {
                    id: Date.now(),
                    title,
                    type,
                    url: finalUrl,
                    category,
                    tags,
                    description,
                    thumbnail: finalThumb
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
        const datalist = document.getElementById('categories-list');
        if (!datalist) return;
        const categories = [...new Set(this.data.items.map(item => item.category))];
        datalist.innerHTML = categories.map(cat => `<option value="${cat}">`).join('');
    }

    updateTagsDatalist() {
        const datalist = document.getElementById('tags-list');
        if (!datalist) return;
        const tags = [...new Set(this.data.items.flatMap(item => item.tags || []))];
        datalist.innerHTML = tags.map(tag => `<option value="${tag}">`).join('');
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

    async deleteItem(id) {
        if (!confirm("Voulez-vous vraiment supprimer cet extrait ?")) return;

        this.showLoading("Suppression de l'extrait...");
        try {
            const itemToDelete = this.data.items.find(item => item.id === id);
            this.data.items = this.data.items.filter(item => item.id !== id);

            const updatedContent = JSON.stringify(this.data, null, 2);
            await this.github.updateFile('data.json', updatedContent, `Suppression extrait : ${itemToDelete ? itemToDelete.title : id}`);

            this.hideLoading();
            alert("Supprimé avec succès !");
            location.reload();
        } catch (err) {
            this.hideLoading();
            alert("Erreur lors de la suppression : " + err.message);
        }
    }

    setupProfilePic() {
        const trigger = document.getElementById('profile-pic-trigger');
        const input = document.getElementById('profile-pic-input');
        const img = document.getElementById('athlete-pic');

        trigger.onclick = () => {
            if (!this.isAdmin) return;
            input.click();
        };

        input.onchange = async () => {
            if (input.files.length === 0 || !this.github) return;

            const file = input.files[0];
            try {
                this.showLoading("Préparation du recadrage...");
                const base64 = await this.showCropper(file, 1);

                const path = `media/profile/${file.name}`;
                this.showLoading("Mise à jour de la photo de profil...");

                // 1. Upload de la photo
                await this.github.updateFile(path, base64, "Mise à jour photo de profil", true);

                // 2. Mettre à jour data.json localement
                this.data.athlete.profilePicture = path;
                img.src = path;

                // 3. Sauvegarder data.json sur GitHub
                const updatedContent = JSON.stringify(this.data, null, 2);
                await this.github.updateFile('data.json', updatedContent, "Mise à jour photo de profil (data)");

                this.hideLoading();
                alert("Photo de profil mise à jour avec succès !");
            } catch (err) {
                this.hideLoading();
                alert("Erreur lors de la mise à jour : " + err.message);
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

    showCropper(file, ratio) {
        return new Promise((resolve, reject) => {
            const modal = document.getElementById('cropper-modal');
            const image = document.getElementById('cropper-image');
            const saveBtn = document.getElementById('cropper-save');
            const cancelBtn = document.getElementById('cropper-cancel');

            const reader = new FileReader();
            reader.onload = (e) => {
                image.src = e.target.result;
                modal.style.display = 'flex';

                const cropper = new Cropper(image, {
                    aspectRatio: ratio,
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 1,
                    restore: false,
                    guides: true,
                    center: true,
                    highlight: false,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false,
                });

                const cleanup = () => {
                    cropper.destroy();
                    modal.style.display = 'none';
                };

                saveBtn.onclick = () => {
                    const canvas = cropper.getCroppedCanvas({
                        width: ratio === 1 ? 400 : 1280, // High enough resolution
                        height: ratio === 1 ? 400 : 720,
                    });
                    const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
                    cleanup();
                    resolve(base64);
                };

                cancelBtn.onclick = () => {
                    cleanup();
                    reject(new Error("Recadrage annulé"));
                };
            };
            reader.readAsDataURL(file);
        });
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }
}
