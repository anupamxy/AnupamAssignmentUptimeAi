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
    {
      name: 'Arctic Code Vault',
      color: '#0969da',
      icon: 'M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM4.5 7.5a.5.5 0 0 0 0 1h2.793l-.853.854a.5.5 0 1 0 .707.707l1.707-1.707a.5.5 0 0 0 0-.708L7.147 5.94a.5.5 0 1 0-.707.707l.853.854H4.5Z'
    },
    {
      name: 'YOLO',
      color: '#e85aad',
      icon: 'M7.998 14.5c2.832 0 5-1.98 5-4.5 0-1.463-.68-2.19-1.879-3.383l-.036-.037c-1.013-1.008-2.3-2.29-2.834-4.434-.322.256-.63.579-.864.953-.432.696-.621 1.58-.046 2.73.473.947.67 2.284-.278 3.232-.61.61-1.545.84-2.403.525a2.599 2.599 0 0 1-1.645-1.76c-.278-1.005-.108-2.177.574-3.085.122-.163.258-.303.395-.437-.257.108-.542.276-.809.52-.672.612-1.245 1.626-1.245 3.406 0 2.52 2.168 4.5 5 4.5Zm4.09-12.71-.042.02c-.108.046-.108.046-.104-.04l.005-.079a2.874 2.874 0 0 1 .505-1.455c-.084.042-.168.096-.253.161A3.92 3.92 0 0 0 11.16 2.23v.001c-.242.478-.402 1.048-.459 1.73-.161-.005-.313-.053-.45-.16a.554.554 0 0 1-.2-.41c-.009-.33.105-.719.39-1.225.17-.303.373-.597.59-.867a7.964 7.964 0 0 0-3.034 0c.217.27.42.564.59.867.285.506.399.895.39 1.224a.554.554 0 0 1-.2.411c-.137.107-.289.155-.45.16-.057-.682-.217-1.252-.459-1.73v-.001A3.914 3.914 0 0 0 6.95.396c-.085-.065-.17-.12-.253-.161A2.874 2.874 0 0 1 7.2 1.69l.005.079c.004.086.004.086-.103.04l-.043-.02A4.834 4.834 0 0 0 5.25 1.5c.542 1.618 1.878 2.502 2.869 3.152l.069.046c.33.218.623.412.86.629.237-.217.53-.411.86-.629l.069-.046c.99-.65 2.326-1.534 2.868-3.152a4.834 4.834 0 0 0-1.808.29Z'
    },
    {
      name: 'Pull Shark',
      color: '#bf8700',
      icon: 'M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z'
    },
    {
      name: 'Quickdraw',
      color: '#57ab5a',
      icon: 'M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z'
    }
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
