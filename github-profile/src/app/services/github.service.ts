import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  GitHubUser, GitHubRepo, ContributionDay, GitHubFollower,
  GitHubGist, GitHubGPGKey, GitHubSSHKey, GitHubSSHSigningKey,
  GitHubEvent, GitHubSubscription
} from '../models/github.models';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiBase = 'https://api.github.com';
  private username = 'shreeramk';

  constructor(private http: HttpClient) {}

  // ── 1. GET /users/{username} ──
  getUser(): Observable<GitHubUser> {
    return this.http.get<GitHubUser>(`${this.apiBase}/users/${this.username}`);
  }

  // ── 2. GET /users/{username}/repos ──
  getRepos(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=6&type=all`
    );
  }

  // ── 3. GET /users/{username}/repos (all repos for Repositories tab) ──
  getAllRepos(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=30&type=all`
    ).pipe(catchError(() => of([])));
  }

  // ── 4. GET /users/{username}/followers ──
  getFollowers(): Observable<GitHubFollower[]> {
    return this.http.get<GitHubFollower[]>(
      `${this.apiBase}/users/${this.username}/followers?per_page=10`
    ).pipe(catchError(() => of([])));
  }

  // ── 5. GET /users/{username}/following ──
  getFollowing(): Observable<GitHubFollower[]> {
    return this.http.get<GitHubFollower[]>(
      `${this.apiBase}/users/${this.username}/following?per_page=10`
    ).pipe(catchError(() => of([])));
  }

  // ── 6. GET /users/{username}/starred ──
  getStarredRepos(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `${this.apiBase}/users/${this.username}/starred?per_page=30&sort=updated`
    ).pipe(catchError(() => of([])));
  }

  // ── 7. GET /users/{username}/gists ──
  getGists(): Observable<GitHubGist[]> {
    return this.http.get<GitHubGist[]>(
      `${this.apiBase}/users/${this.username}/gists?per_page=10`
    ).pipe(catchError(() => of([])));
  }

  // ── 8. GET /users/{username}/subscriptions ──
  getSubscriptions(): Observable<GitHubSubscription[]> {
    return this.http.get<GitHubSubscription[]>(
      `${this.apiBase}/users/${this.username}/subscriptions?per_page=10`
    ).pipe(catchError(() => of([])));
  }

  // ── 9. GET /users/{username}/gpg_keys ──
  getGPGKeys(): Observable<GitHubGPGKey[]> {
    return this.http.get<GitHubGPGKey[]>(
      `${this.apiBase}/users/${this.username}/gpg_keys`
    ).pipe(catchError(() => of([])));
  }

  // ── 10. GET /users/{username}/keys ──
  getSSHKeys(): Observable<GitHubSSHKey[]> {
    return this.http.get<GitHubSSHKey[]>(
      `${this.apiBase}/users/${this.username}/keys`
    ).pipe(catchError(() => of([])));
  }

  // ── 11. GET /users/{username}/ssh_signing_keys ──
  getSSHSigningKeys(): Observable<GitHubSSHSigningKey[]> {
    return this.http.get<GitHubSSHSigningKey[]>(
      `${this.apiBase}/users/${this.username}/ssh_signing_keys`
    ).pipe(catchError(() => of([])));
  }

  // ── 12. GET /users/{username}/orgs ──
  getOrganizations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/users/${this.username}/orgs`).pipe(
      catchError(() => of([]))
    );
  }

  // ── 13. GET /users/{username}/social_accounts ──
  getSocialAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/users/${this.username}/social_accounts`).pipe(
      catchError(() => of([]))
    );
  }

  // ── 14. GET /users/{username}/events/public ──
  getEvents(): Observable<GitHubEvent[]> {
    return this.http.get<GitHubEvent[]>(
      `${this.apiBase}/users/${this.username}/events/public?per_page=30`
    ).pipe(catchError(() => of([])));
  }

  // ── 15. GET /users/{username}/received_events ──
  getReceivedEvents(): Observable<GitHubEvent[]> {
    return this.http.get<GitHubEvent[]>(
      `${this.apiBase}/users/${this.username}/received_events/public?per_page=10`
    ).pipe(catchError(() => of([])));
  }

  // ── Contribution data (generated since GitHub doesn't provide this via REST) ──
  getContributions(): Observable<ContributionDay[]> {
    return this.generateContributionData();
  }

  private generateContributionData(): Observable<ContributionDay[]> {
    const days: ContributionDay[] = [];
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const start = new Date(oneYearAgo);
    start.setDate(start.getDate() - start.getDay());

    const current = new Date(start);
    while (current <= now) {
      const dayOfWeek = current.getDay();
      const month = current.getMonth();

      let baseChance = 0.4;
      if (dayOfWeek >= 1 && dayOfWeek <= 5) baseChance = 0.65;
      if ([0, 1, 2, 5, 6, 7, 8, 9].includes(month)) baseChance += 0.1;

      const random = this.seededRandom(current.getTime());
      let count = 0;
      let level = 0;

      if (random < baseChance) {
        const intensity = this.seededRandom(current.getTime() + 1);
        if (intensity < 0.35) { count = Math.floor(intensity * 5) + 1; level = 1; }
        else if (intensity < 0.6) { count = Math.floor(intensity * 8) + 3; level = 2; }
        else if (intensity < 0.85) { count = Math.floor(intensity * 12) + 5; level = 3; }
        else { count = Math.floor(intensity * 20) + 10; level = 4; }
      }

      days.push({
        date: this.formatDate(current),
        count,
        level
      });

      current.setDate(current.getDate() + 1);
    }

    return of(days);
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed / 86400000) * 10000;
    return x - Math.floor(x);
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
