import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddTaskComponent implements OnInit {
  task: Task = {
   title: '',
   transcription: '',
   definition: '',
   sentence: '',
   image: ''
  };
  constructor(private taskService: TaskService) { }

  ngOnInit() {
  }

  onSubmit() {
    if(this.task.title != '' && this.task.transcription != '' && this.task.definition != '' && this.task.sentence != '' && this.task.image != '') {
      this.taskService.addTask(this.task);
      this.task.title = '';
      this.task.transcription = '';
      this.task.definition = '';
      this.task.sentence = '';
      this.task.image = '';
    }
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
      this.task.image = myReader.result;
    }
    myReader.readAsDataURL(file);
  }
}
