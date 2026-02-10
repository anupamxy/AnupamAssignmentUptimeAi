import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GitHubRepo, GitHubGist, GitHubSubscription } from '../../models/github.models';

@Component({
  selector: 'app-tab-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tab-content.component.html',
  styleUrl: './tab-content.component.scss'
})
export class TabContentComponent {
  @Input() tabId: string = '';
  @Input() allRepos: GitHubRepo[] = [];
  @Input() starredRepos: GitHubRepo[] = [];
  @Input() gists: GitHubGist[] = [];
  @Input() subscriptions: GitHubSubscription[] = [];

  repoSearchQuery = '';

  languageColors: { [key: string]: string } = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Jupyter Notebook': '#DA5B0B',
    'Dart': '#00B4AB',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Java': '#b07219',
    'Go': '#00ADD8',
    'Shell': '#89e051',
    'Ruby': '#701516',
    'C++': '#f34b7d',
    'C': '#555555',
    'PHP': '#4F5D95',
    'Swift': '#F05138',
    'Kotlin': '#A97BFF',
    'Rust': '#dea584'
  };

  getTabTitle(): string {
    const titles: { [key: string]: string } = {
      repositories: 'Repositories',
      projects: 'Projects',
      packages: 'Packages',
      stars: 'Stars'
    };
    return titles[this.tabId] || this.tabId;
  }

  getLanguageColor(language: string): string {
    return this.languageColors[language] || '#586069';
  }

  getFilteredRepos(): GitHubRepo[] {
    if (!this.repoSearchQuery.trim()) return this.allRepos;
    const q = this.repoSearchQuery.toLowerCase();
    return this.allRepos.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q))
    );
  }

  getGistFiles(gist: GitHubGist): string[] {
    return Object.keys(gist.files);
  }

  getGistLanguage(gist: GitHubGist): string {
    const files = Object.values(gist.files);
    return files.length > 0 && files[0].language ? files[0].language : '';
  }

  getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
}
