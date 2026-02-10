import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitHubUser, GitHubFollower, GitHubGPGKey, GitHubSSHKey, GitHubSSHSigningKey } from '../../models/github.models';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-sidebar.component.html',
  styleUrl: './profile-sidebar.component.scss'
})
export class ProfileSidebarComponent {
  @Input() user: GitHubUser | null = null;
  @Input() organizations: any[] = [];
  @Input() socialAccounts: any[] = [];
  @Input() followers: GitHubFollower[] = [];
  @Input() following: GitHubFollower[] = [];
  @Input() gpgKeys: GitHubGPGKey[] = [];
  @Input() sshKeys: GitHubSSHKey[] = [];
  @Input() sshSigningKeys: GitHubSSHSigningKey[] = [];

  achievements = [
    { name: 'Arctic Code Vault', color: '#0969da' },
    { name: 'YOLO', color: '#e85aad' },
    { name: 'Pull Shark', color: '#bf8700' },
    { name: 'Quickdraw', color: '#57ab5a' }
  ];

  showFollowersList = false;
  showFollowingList = false;

  getBioLines(): string[] {
    if (!this.user?.bio) return [];
    return this.user.bio.split(/\r?\n/).filter(line => line.trim() !== '');
  }

  getSocialByProvider(provider: string): any | null {
    return this.socialAccounts.find(a => a.provider === provider) || null;
  }

  toggleFollowers(): void {
    this.showFollowersList = !this.showFollowersList;
    this.showFollowingList = false;
  }

  toggleFollowing(): void {
    this.showFollowingList = !this.showFollowingList;
    this.showFollowersList = false;
  }

  getMemberSince(): string {
    if (!this.user?.created_at) return '';
    const date = new Date(this.user.created_at);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
