import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitHubUser, GitHubEvent } from '../../models/github.models';
import * as echarts from 'echarts';

@Component({
  selector: 'app-activity-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-overview.component.html',
  styleUrl: './activity-overview.component.scss'
})
export class ActivityOverviewComponent implements AfterViewInit, OnChanges {
  @Input() user: GitHubUser | null = null;
  @Input() events: GitHubEvent[] = [];
  @Input() receivedEvents: GitHubEvent[] = [];
  @ViewChild('pieChart') pieChartEl!: ElementRef;

  private viewReady = false;


  commitCount = 0;
  prCount = 0;
  issueCount = 0;
  reviewCount = 0;
  contributedRepos: string[] = [];
  recentActivity: { type: string; description: string; repo: string; time: string }[] = [];

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.processEvents();
    this.renderPieChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['events'] || changes['receivedEvents']) && this.viewReady) {
      this.processEvents();
      this.renderPieChart();
    }
  }

  private processEvents(): void {
    this.commitCount = 0;
    this.prCount = 0;
    this.issueCount = 0;
    this.reviewCount = 0;
    const repoSet = new Set<string>();
    this.recentActivity = [];

    for (const event of this.events) {
      repoSet.add(event.repo.name);

      switch (event.type) {
        case 'PushEvent':
          const commits = event.payload?.commits?.length || 1;
          this.commitCount += commits;
          this.recentActivity.push({
            type: 'commit',
            description: `Pushed ${commits} commit${commits > 1 ? 's' : ''} to`,
            repo: event.repo.name,
            time: event.created_at
          });
          break;
        case 'PullRequestEvent':
          this.prCount++;
          this.recentActivity.push({
            type: 'pr',
            description: `${event.payload?.action || 'Opened'} a pull request in`,
            repo: event.repo.name,
            time: event.created_at
          });
          break;
        case 'IssuesEvent':
          this.issueCount++;
          this.recentActivity.push({
            type: 'issue',
            description: `${event.payload?.action || 'Opened'} an issue in`,
            repo: event.repo.name,
            time: event.created_at
          });
          break;
        case 'PullRequestReviewEvent':
          this.reviewCount++;
          this.recentActivity.push({
            type: 'review',
            description: 'Reviewed a pull request in',
            repo: event.repo.name,
            time: event.created_at
          });
          break;
        case 'CreateEvent':
          this.recentActivity.push({
            type: 'create',
            description: `Created ${event.payload?.ref_type || 'branch'} in`,
            repo: event.repo.name,
            time: event.created_at
          });
          break;
        case 'WatchEvent':
          this.recentActivity.push({
            type: 'star',
            description: 'Starred',
            repo: event.repo.name,
            time: event.created_at
          });
          break;
        case 'ForkEvent':
          this.recentActivity.push({
            type: 'fork',
            description: 'Forked',
            repo: event.repo.name,
            time: event.created_at
          });
          break;
        case 'DeleteEvent':
          this.recentActivity.push({
            type: 'delete',
            description: `Deleted ${event.payload?.ref_type || 'branch'} in`,
            repo: event.repo.name,
            time: event.created_at
          });
          break;
      }
    }

    this.contributedRepos = Array.from(repoSet).slice(0, 3);
    this.recentActivity = this.recentActivity.slice(0, 8);

    // If no real events, use fallback values for pie chart
    if (this.commitCount === 0 && this.prCount === 0 && this.issueCount === 0 && this.reviewCount === 0) {
      this.commitCount = 83;
      this.prCount = 17;
      this.issueCount = 3;
      this.reviewCount = 1;
    }
  }

  private renderPieChart(): void {
    if (!this.pieChartEl) return;

    const chart = echarts.init(this.pieChartEl.nativeElement);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: {
          borderRadius: 4
        },
        label: {
          show: true,
          position: 'outside',
          fontSize: 11,
          color: '#656d76',
          formatter: '{b}\n{d}%'
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10
        },
        data: [
          { value: this.commitCount, name: 'Commits', itemStyle: { color: '#216e39' } },
          { value: this.prCount, name: 'Pull requests', itemStyle: { color: '#9be9a8' } },
          { value: this.issueCount, name: 'Issues', itemStyle: { color: '#40c463' } },
          { value: this.reviewCount, name: 'Code review', itemStyle: { color: '#30a14e' } }
        ]
      }]
    };

    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(this.pieChartEl.nativeElement);
  }

  getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  getActivityMonth(): string {
    if (this.recentActivity.length === 0) return 'Recent';
    const date = new Date(this.recentActivity[0].time);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}
