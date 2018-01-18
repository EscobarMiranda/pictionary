import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit {
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
    this.taskService.updateTask(task);
    this.taskToEdit = null;
    this.editState = false;
  }

  generatePDF() {
    
    var docDefinition = {
      // a string or { width: number, height: number }
    pageSize: 'A5',
  
    // by default we use portrait, you can change it to landscape if you wish
    pageOrientation: 'portrait',
      content: this.getDataToGeneratePDF(),
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
          alignment: 'center'
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
        }
      }
    };
    pdfMake.createPdf(docDefinition).download('piccionario_rosella.pdf');
  }

  getDataToGeneratePDF() {
    var result = [];
    this.tasks.forEach(task => {
      result.push(
        { text: task.title, style: 'title' },
        { text: task.transcription, style: 'transcription' },
        { text: 'Definition', style: 'title2' },
        { text: task.definition, style: 'description' },
        { text: 'Sentence', style: 'title2' },
        { text: task.sentence, style: 'sentence' },
        { image: task.image, style: 'image', width: 250, pageBreak: 'after' },
      );
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
      this.taskToEdit = myReader.result;
    }
    myReader.readAsDataURL(file);
  }
}
