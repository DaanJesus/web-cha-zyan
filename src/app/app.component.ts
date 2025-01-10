import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPresenceDialogComponent } from './dialog/confirm-presence-dialog/confirm-presence-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Chá do Zyan';
  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  isMobile: boolean = false;

  isFixed = false;
  currentId: string | null = null;
  sliderWidth = '0px';
  sliderLeft = '0px';
  private tabContainerHeight = 190;

  ngOnInit(): void {
    this.checkIfMobile();
    this.checkTabContainerPosition();
  }

  checkIfMobile(): void {
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkTabContainerPosition();
    this.findCurrentTabSelector();
  }

  onTabClick(event: Event, id: string): void {
    event.preventDefault();
    const clickedTab = document.querySelector(`a[href="#${id}"]`) as HTMLElement;

    this.setSliderCss(clickedTab);

    const element = document.getElementById(id);
    if (element) {
      const scrollTop = element.offsetTop - this.tabContainerHeight + 1;
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
    this.currentId = id;
  }



  private checkTabContainerPosition(): void {
    const heroTabs = document.querySelector('.et-hero-tabs') as HTMLElement;
    if (!heroTabs) return;

    const offset =
      heroTabs.offsetTop + heroTabs.offsetHeight - this.tabContainerHeight;
    this.isFixed = window.scrollY > offset;
  }

  private findCurrentTabSelector(): void {
    if (this.currentId) return;

    const tabs = document.querySelectorAll('.et-hero-tab');
    let newCurrentId: string | null = null;
    let newCurrentTab: HTMLElement | null = null;

    tabs.forEach((tab) => {
      const id = tab.getAttribute('href')?.substring(1);
      if (!id) return;

      const element = document.getElementById(id);
      if (!element) return;

      const offsetTop = element.offsetTop - this.tabContainerHeight;
      const offsetBottom = offsetTop + element.offsetHeight;

      if (window.scrollY > offsetTop && window.scrollY < offsetBottom) {
        newCurrentId = id;
        newCurrentTab = tab as HTMLElement;
      }
    });

    if (this.currentId !== newCurrentId && newCurrentId) {
      this.currentId = newCurrentId;
      this.setSliderCss(newCurrentTab);
    }
  }

  private setSliderCss(tab: HTMLElement | null): void {
    if (!tab) return;

    this.sliderWidth = `${tab.offsetWidth}px`;
    this.sliderLeft = `${tab.offsetLeft}px`;
  }

  openConfirmPresenceDialog(): void {
    this.dialog.open(ConfirmPresenceDialogComponent, {
      width: '400px',
      height: 'auto'
    });
  }

  ngAfterViewInit(): void {
  }
}