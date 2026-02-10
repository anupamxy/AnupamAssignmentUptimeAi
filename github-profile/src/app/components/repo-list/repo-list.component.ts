import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitHubRepo } from '../../models/github.models';

@Component({
  selector: 'app-repo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repo-list.component.html',
  styleUrl: './repo-list.component.scss'
})
export class RepoListComponent {
  @Input() repos: GitHubRepo[] = [];

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
    'Ruby': '#701516'
  };

  getLanguageColor(language: string): string {
    return this.languageColors[language] || '#586069';
  }
}
