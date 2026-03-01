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
        // Ajout d'un timestamp pour éviter le cache du navigateur
        const response = await fetch(`${this.baseUrl}/contents/${path}?t=${Date.now()}`, {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) throw new Error(`Erreur GitHub: ${response.statusText}`);
        return await response.json();
    }

    async updateFile(path, content, message, isBase64 = false) {
        let sha = null;
        try {
            const fileData = await this.getFile(path);
            sha = fileData.sha;
        } catch (e) {
            // Le fichier n'existe peut-être pas encore (ex: premier upload d'image)
            console.log("Nouveau fichier détecté");
        }

        const encodedContent = isBase64 ? content : btoa(unescape(encodeURIComponent(content)));

        const response = await fetch(`${this.baseUrl}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                content: encodedContent,
                sha: sha
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Erreur GitHub: ${error.message}`);
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
