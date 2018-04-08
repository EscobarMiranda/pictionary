import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
  transform(array: any[]): any[] {
    array.sort(function(a, b)
    {
        if(a['module'] === b['module'])
        {
            var x = a['title'].toLowerCase(), y = b['title'].toLowerCase();
            
            return x < y ? -1 : x > y ? 1 : 0;
        }
        return a['module'] - b['module'];
    });
    return array;
  }
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TasksComponent implements OnInit {
  showSpinner: boolean = false;
  newImage: string = '';
  tasks: Task[];
  editState: boolean = false;
  taskToEdit: Task;

  constructor(public taskService: TaskService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      //console.log(tasks);
      this.tasks = tasks;
    });
  }

  deleteTask(event, task) {
    const response = confirm('¿Realmente desea eliminar esta palabra?');
    if (response ) {
      this.taskService.deleteTask(task);
    }
    return;
  }

  editTask(event, task) {
    this.editState = !this.editState;
    this.taskToEdit = task;
  }

  updateTask(task) {
    if (this.newImage !== '') {
      task.image = this.newImage;
    }
    this.taskService.updateTask(task);
    this.taskToEdit = null;
    this.editState = false;
    this.newImage = '';
  }

  generatePDF() {
    this.showSpinner = true;
    var dataContent = this.getDataToGeneratePDF();
    var docDefinition = {
      // a string or { width: number, height: number }
    pageSize: 'A5',
  
    // by default we use portrait, you can change it to landscape if you wish
    pageOrientation: 'portrait',
      content: dataContent,
      styles: {
        title: {
          fontSize: 22,
          bold: true,
          alignment: 'center'
        },
        transcription: {
          fontSize: 19,
          color: 'gray',
          italics: true,
          alignment: 'center'
        },
        definition: {
          alignment: 'center'
        },
        sentence: {
          alignment: 'left'
        },
        image: {
          alignment: 'center',
          margin: [0, 30]
        },
        title2: {
          fontSize: 15,
          color: '#19194d',
          alignment: 'left',
          margin: [0, 10]
        },
        module: {
          fontSize: 12,
          color: '#000454',
          alignment: 'right'
        },
        titleCoverPage: {
          fontSize: 15,
          alignment: 'center',
          margin: [0, 10]
        },
        title2CoverPage: {
          fontSize: 10,
          alignment: 'center',
          margin: [0, 20]
        },
        titleModuleSection: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          margin: [0, 200],
          color: '#000454'
        },
      }
    };
    
    if (dataContent.length > 0) {
      pdfMake.createPdf(docDefinition).download('piccionario_rosella.pdf');
    }
    
    this.showSpinner = false;
  }

  getDataToGeneratePDF() {
    var result = [];
    var count = 1;
    var logo1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmAAAAB4CAYAAABVcU4PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDRDZGNThCMkFDNUMxMUU3Qjk2MkUzRENFOUY5M0IyMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDRDZGNThCM0FDNUMxMUU3Qjk2MkUzRENFOUY5M0IyMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkNENkY1OEIwQUM1QzExRTdCOTYyRTNEQ0U5RjkzQjIzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkNENkY1OEIxQUM1QzExRTdCOTYyRTNEQ0U5RjkzQjIzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2pShAgAAT9JJREFU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';
    var logo2 = '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';
    var logo3 = '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';

    result.push(
      { image: logo1 + logo2 + logo3, style: 'image', width: 200 },
      { text: 'Latin University of Costa Rica', style: 'titleCoverPage' },
      { text: 'Social Science Faculty', style: 'title2CoverPage' },
      { text: 'Bilingual Preschool Education', style: 'title2CoverPage' },
      { text: 'Pictionary', style: 'title2CoverPage' },
      { text: 'English III', style: 'title2CoverPage' },
      { text: 'Teacher: Andrea Serrano', style: 'title2CoverPage' },
      { text: 'Student: Rosella Chaves - 20170120842', style: 'title2CoverPage' },
      { text: 'San José, April, 2018', style: 'title2CoverPage' },
      { text: '', pageBreak: 'after' }
    );
    
    this.tasks.sort(function(a, b)
    {
        if(Number(a['module']) === Number(b['module']))
        {
            var x = a['title'].toLowerCase(), y = b['title'].toLowerCase();
            
            return x < y ? -1 : x > y ? 1 : 0;
        }
        return Number(a['module']) < Number(b['module']) ? -1 : Number(a['module']) > Number(b['module']) ? 1 : 0;
    });

    var moduleNumber = 0;
    this.tasks.forEach(task => {
      console.log(task.title);
      if (task.image === '') {
        alert(`Error al generar el PDF, imagen pendiente en la palabra ${task.title}`);
        result = [];
        return result;
      }

      if (Number(task.module) > moduleNumber) {
        result.push(
          { text: 'Module: ' + task.module, style: 'titleModuleSection' },
          { text: '', pageBreak: 'after' }
        );
        moduleNumber = Number(task.module);
      }
      
      result.push(
        { text: 'Module: ' + task.module, style: 'module' },
        { text: task.title, style: 'title' },
        { text: task.transcription, style: 'transcription' },
        { text: 'Definition', style: 'title2' },
        { text: task.definition, style: 'description' },
        { text: 'Sentence', style: 'title2' },
        { text: task.sentence, style: 'sentence' },
        { text: 'Image', style: 'title2' },
        { image: task.image, style: 'image', width: 200 }
      );

      if (this.tasks.length > count) {
        result.push(
          { text: '', pageBreak: 'after' }
        );
      }
      count++;
    });
    return result;
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
      this.newImage = myReader.result;
    }
    myReader.readAsDataURL(file);
  }
}
