import { Component, OnInit,NgZone } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BuildingsService } from '../../services/buildings.service'; 
import { UserService } from '../../services/user.service';
import { SearchEngineService } from '../../services/search-engine.service';
import 'firebase/firestore';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
Chart.register(...registerables);

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.css']
})
export class AdminpageComponent implements OnInit {

summaryItemValue: any;
mostCommonType: any;
mostsearchedterm: any;
  numberoftimes: any;
item: any;
  constructor(private firestore: AngularFirestore ,private buildingsService: BuildingsService,private userService:UserService,private router:Router,private location: Location,private searchEngine:SearchEngineService) {} 
  mostCommonArea: string = ''; 
  mostCommonsellingArea:string='';
  total:number = 0;
  totalsold:number = 0;
  numberofuser:number = 0;
  words: any[]=[];
  ngOnInit(): void {
    this.firestore.collection('Words').valueChanges().subscribe((data: any[]) => {
      this.words = data;
    });
    this.buildingsService.getbuildings().subscribe(data => {
      const areaCounts = this.aggregateAreaCounts(data);
      this.mostCommonArea = this.calculateMostCommonArea(areaCounts);
      const ctx = document.getElementById('myPieChart') as HTMLCanvasElement;
      const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(areaCounts),
          datasets: [
            {
              label: 'Building Counts by Area',
              data: Object.values(areaCounts),
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
              ],
            },
          ],
        },
      });
      const areasoldCounts = this.aggregateAreasoldCounts(data);
      this.mostCommonsellingArea=this.calculateMostCommonArea(areasoldCounts);
      const ctx2 = document.getElementById('mybarChart2') as HTMLCanvasElement;
      const mybarChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: Object.keys(areasoldCounts),
          datasets: [
            {
              label: 'Building sold Counts by Area',
              data: Object.values(areasoldCounts),
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
              ],
            },
          ],
        },
      });
      const typeCounts = this.aggregateTypeofbuilding(data);
      this.mostCommonType=this.calculateMostCommonArea(typeCounts);
      const ctx3 = document.getElementById('myPieChart3') as HTMLCanvasElement;
      const mypieChart3 = new Chart(ctx3, {
        type: 'pie',
        data: {
          labels: Object.keys(typeCounts),
          datasets: [
            {
              label: 'types of buildings count',
              data: Object.values(typeCounts),
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
              ],
            },
          ],
        },
      });
    });
    this.userService.getUsers().subscribe(data=>{
      this.numberofuser = data.length;
    });
    this.searchEngine.getseachterms().subscribe(data=>{
      const searchCounts = this.aggregateSearchTermsCounts(data);
      this.mostsearchedterm=this.calculateMostCommonArea(searchCounts);
      const ctx4 = document.getElementById('myPieChart4') as HTMLCanvasElement;
      const myPieChart4 = new Chart(ctx4, {
        type: 'pie',
        data: {
          labels: Object.keys(searchCounts),
          datasets: [
            {
              label: 'search Terms',
              data: Object.values(searchCounts),
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
              ],
            },
          ],
        },
      });
    });
  }
  private calculateMostCommonArea(areaCounts: { [area: string]: number }): string {
    let mostCommon = '';
    let maxCount = 0;
    for (const area in areaCounts) {
      if (areaCounts[area] > maxCount) {
        maxCount = areaCounts[area];
        mostCommon = area;
        console.log("hi ")
      }
    }
    return mostCommon;
  }
  private aggregateSearchTermsCounts(data: any[]): { [area: string]: number } {
    const termCounts: { [area: string]: number } = {};
    data.forEach(item => {
      if(item.searchTerm){
      const term = item.searchTerm; 
      if (termCounts[term]) {
        termCounts[term]++;
      } else {
        termCounts[term] = 1;
      }
    }});
    return termCounts;
  }
  private aggregateAreasoldCounts(data: any[]): { [area: string]: number } {
    const areaCounts: { [area: string]: number } = {};
    data.forEach(item => {
      if(item.sold){
        this.totalsold++;
      const area = item.area; 
      if (areaCounts[area]) {
        areaCounts[area]++;
      } else {
        areaCounts[area] = 1;
      }
    }});
    return areaCounts;
  }
  async addWord() {
    if (this.item.trim() !== '') {
      try {
        const docRef = this.firestore.collection("Words").doc(); 
        const newDocId = docRef.ref.id;
        await docRef.set({
          dictionary:  this.item,
          Uid : newDocId
        });
        console.log('Word added successfully.');
        this.item = ''; 
      } catch (error) {
        console.error('Error adding word:', error);
      }
    }
  }
  deleteWord(id: string) {
    this.firestore.collection('Words').doc(id).delete()
      .then(() => {
        console.log('Word deleted successfully.');
      })
      .catch(error => {
        console.error('Error deleting word:', error);
      });
  }
  private aggregateTypeofbuilding(data: any[]): { [area: string]: number } {
    const typeCounts: { [area: string]: number } = {};
    data.forEach(item => {
      if(item.type){
      const type = item.type; 
      if (typeCounts[type]) {
        typeCounts[type]++;
      } else {
        typeCounts[type] = 1;
      }
    }});
    return typeCounts;
  }
  private aggregateAreaCounts(data: any[]): { [area: string]: number } {
    const areaCounts: { [area: string]: number } = {};
    data.forEach(item => {
      this.total++;
      const area = item.area; 
      if (areaCounts[area]) {
        areaCounts[area]++;
      } else {
        areaCounts[area] = 1;
      }
    });
    return areaCounts;
  }
  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
  signOut() {
    const navigationExtras: NavigationExtras = {
      replaceUrl: true 
    };
    this.router.navigate(['/loginpage']);
    this.location.forward();
  }
}