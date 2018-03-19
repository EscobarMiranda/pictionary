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
        }
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
    
    this.tasks.sort(function(a, b)
    {
        if(a['module'] === b['module'])
        {
            var x = a['title'].toLowerCase(), y = b['title'].toLowerCase();
            
            return x < y ? -1 : x > y ? 1 : 0;
        }
        return a['module'] < b['module'] ? -1 : a['module'] > b['module'] ? 1 : 0;
    });

    this.tasks.forEach(task => {
      console.log(task.title);
      if (task.image === '') {
        alert(`Error al generar el PDF, imagen pendiente en la palabra ${task.title}`);
        result = [];
        return result;
      }
      
      result.push(
        { text: task.module, style: 'module' },
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
