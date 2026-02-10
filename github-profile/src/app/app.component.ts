import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSidebarComponent } from './components/profile-sidebar/profile-sidebar.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ContributionGraphComponent } from './components/contribution-graph/contribution-graph.component';
import { RepoListComponent } from './components/repo-list/repo-list.component';
import { ActivityOverviewComponent } from './components/activity-overview/activity-overview.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { GithubService } from './services/github.service';
import {
  GitHubUser, GitHubRepo, ContributionDay, GitHubFollower,
  GitHubGist, GitHubGPGKey, GitHubSSHKey, GitHubSSHSigningKey,
  GitHubEvent, GitHubSubscription
} from './models/github.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ProfileSidebarComponent,
    ProfileHeaderComponent,
    ContributionGraphComponent,
    RepoListComponent,
    ActivityOverviewComponent,
    TabContentComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  user: GitHubUser | null = null;
  repos: GitHubRepo[] = [];
  allRepos: GitHubRepo[] = [];
  contributions: ContributionDay[] = [];
  organizations: any[] = [];
  socialAccounts: any[] = [];
  followers: GitHubFollower[] = [];
  following: GitHubFollower[] = [];
  starredRepos: GitHubRepo[] = [];
  gists: GitHubGist[] = [];
  subscriptions: GitHubSubscription[] = [];
  gpgKeys: GitHubGPGKey[] = [];
  sshKeys: GitHubSSHKey[] = [];
  sshSigningKeys: GitHubSSHSigningKey[] = [];
  events: GitHubEvent[] = [];
  receivedEvents: GitHubEvent[] = [];
  activeTab = 'overview';
  loading = true;

  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'repositories', label: 'Repositories', count: 0 },
    { id: 'projects', label: 'Projects', count: 0 },
    { id: 'packages', label: 'Packages', count: 0 },
    { id: 'stars', label: 'Stars', count: 0 }
  ];

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    // API 1: GET /users/{username}
    this.githubService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        this.tabs[1].count = user.public_repos;
        this.tabs[2].count = user.public_gists;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    // API 2: GET /users/{username}/repos (pinned/top 6)
    this.githubService.getRepos().subscribe({
      next: (repos) => this.repos = repos
    });

    // API 3: GET /users/{username}/repos (all repos)
    this.githubService.getAllRepos().subscribe({
      next: (repos) => this.allRepos = repos
    });

    // Contribution data (generated)
    this.githubService.getContributions().subscribe({
      next: (contributions) => this.contributions = contributions
    });

    // API 4: GET /users/{username}/orgs
    this.githubService.getOrganizations().subscribe({
      next: (orgs) => this.organizations = orgs
    });

    // API 5: GET /users/{username}/social_accounts
    this.githubService.getSocialAccounts().subscribe({
      next: (accounts) => this.socialAccounts = accounts
    });

    // API 6: GET /users/{username}/followers
    this.githubService.getFollowers().subscribe({
      next: (followers) => this.followers = followers
    });

    // API 7: GET /users/{username}/following
    this.githubService.getFollowing().subscribe({
      next: (following) => this.following = following
    });

    // API 8: GET /users/{username}/starred
    this.githubService.getStarredRepos().subscribe({
      next: (starred) => {
        this.starredRepos = starred;
        this.tabs[4].count = starred.length;
      }
    });

    // API 9: GET /users/{username}/gists
    this.githubService.getGists().subscribe({
      next: (gists) => this.gists = gists
    });

    // API 10: GET /users/{username}/subscriptions
    this.githubService.getSubscriptions().subscribe({
      next: (subs) => this.subscriptions = subs
    });

    // API 11: GET /users/{username}/gpg_keys
    this.githubService.getGPGKeys().subscribe({
      next: (keys) => this.gpgKeys = keys
    });

    // API 12: GET /users/{username}/keys
    this.githubService.getSSHKeys().subscribe({
      next: (keys) => this.sshKeys = keys
    });

    // API 13: GET /users/{username}/ssh_signing_keys
    this.githubService.getSSHSigningKeys().subscribe({
      next: (keys) => this.sshSigningKeys = keys
    });

    // API 14: GET /users/{username}/events/public
    this.githubService.getEvents().subscribe({
      next: (events) => this.events = events
    });

    // API 15: GET /users/{username}/received_events/public
    this.githubService.getReceivedEvents().subscribe({
      next: (events) => this.receivedEvents = events
    });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getTotalContributions(): number {
    return this.contributions.reduce((sum, day) => sum + day.count, 0);
  }
}
