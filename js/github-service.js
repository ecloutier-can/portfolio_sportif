/**
 * Service pour interagir avec l'API GitHub (Octokit)
 * Permet de sauvegarder data.json et d'explorer les fichiers média.
 */
export class GitHubService {
    constructor(owner, repo, token) {
        this.owner = owner;
        this.repo = repo;
        this.token = token;
        this.baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
    }

    async getFile(path) {
        const response = await fetch(`${this.baseUrl}/contents/${path}`, {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) throw new Error(`Erreur GitHub: ${response.statusText}`);
        return await response.json();
    }

    async updateFile(path, content, message) {
        // 1. Récupérer le SHA actuel du fichier pour pouvoir le mettre à jour
        const fileData = await this.getFile(path);
        const sha = fileData.sha;

        // 2. Envoyer la mise à jour
        const response = await fetch(`${this.baseUrl}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                content: btoa(unescape(encodeURIComponent(content))), // Base64 encoding for UTF-8
                sha: sha
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Erreur de sauvegarde: ${error.message}`);
        }
        return await response.json();
    }

    async listMediaFolders(path = 'media') {
        const response = await fetch(`${this.baseUrl}/contents/${path}`, {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) throw new Error(`Erreur lors du listing des médias: ${response.statusText}`);
        const items = await response.json();
        return items.filter(item => item.type === 'dir');
    }

    async listFiles(path) {
        const response = await fetch(`${this.baseUrl}/contents/${path}`, {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) throw new Error(`Erreur lors du listing des fichiers: ${response.statusText}`);
        return await response.json();
    }
}
