import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { Todo } from '../../models/todo.model';
import { UserService } from '../../services/user-service';
import { TodoService } from '../../services/todo-service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-todos',
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos implements OnInit {
  users: User[] = [];
  todos: Todo[] = [];
  selectedUser?: User;
  selectedUserId: number | string = '';
  newTodoTitle: string = '';
  currentEditingTodoId: number | null = null;
  currentEditingTodoTitle: string  ='';

  private _userService = inject(UserService);
  private _todoService = inject(TodoService);

  ngOnInit(): void {
    this._userService
      .fetchUsers()
      .pipe(
        catchError((error) => {
          console.error('Error fetching users:', error);
          return of([]);
        }),
      )
      .subscribe((res) => {
        this.users = res;
      });
  }

  fetchTodos(userId: number): void {
    console.log('fetching todos for user with id:', userId);
    this._todoService.fetchTodos(userId).subscribe({
      next: (todos) => {
        this.todos = todos;
        console.log(`Fetched  todos:`, this.todos);
      },
      error: (error) => {
        console.error(`Error fetching todos for user ${userId}:`, error);
      },
    });
  }

  onUserSelect(): void {
    if (!this.selectedUserId) return;
    this._userService.findUsersById(+this.selectedUserId).subscribe({
      next: (user) => {
        if (!user) {
          console.error(`Selected user not found`);
          return;
        }
        this.selectedUser = user;
        this.fetchTodos(this.selectedUser.id);
      },
      error: (err) => console.error(`Error fetching user:`, err)
    });
  }

  addTodo():void{
    if(!this.newTodoTitle.trim() || !this.selectedUser){
  alert('please select a user and enter a todo title')
      return;
      }  
    const newTodo = {
      userId:this.selectedUser.id,
      title:this.newTodoTitle,
      completed:false,
    }

    this._todoService.addTodo(newTodo);
    this.todos = this._todoService.getTodos();
    this.newTodoTitle = '';
    }

    deleteTodo(todoId:number):void{
      this._todoService.deleteTodo(todoId);
      this.todos = this._todoService.getTodos();
    }

    openEditModal(todo:Todo):void{
      this.currentEditingTodoId = todo.id;
      this.currentEditingTodoTitle = todo.title;
    }

    saveChanges(updatedTitle:string):void{
      if(this.currentEditingTodoId && updatedTitle.trim()){
        this._todoService.editTodoById(this.currentEditingTodoId,{
          title:updatedTitle,
        });
        this.todos = this._todoService.getTodos();
        this.currentEditingTodoId = null;
        this.currentEditingTodoTitle = ''
      }
    }
}
