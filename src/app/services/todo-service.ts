import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { catchError, map, Observable } from 'rxjs';
import { Todos } from '../components/todos/todos';


const API_URL = '  https://jsonplaceholder.typicode.com/todos';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
private  todos: Todo[] = [];
  private _httpclient = inject(HttpClient);


  getTodos(): Todo[] {

    return this.todos;
  }

  fetchTodos(userId:number):Observable<Todo []>{
return this._httpclient.get<Todo[]>(`${API_URL}?userId=${userId}`).pipe(
  catchError((error:HttpErrorResponse)=>{
    console.error(`Error fetching todos for user with id ${userId}:`, error);
    throw new Error(`Error occurred while fetching todos for user with id ${userId}`);
  }),
  map((todos)=>{
    this.todos = todos
  return todos;
  })

  )
  }

  addTodo(newTodo:Partial<Todo>):void{
      const todoId = Math.max(...this.todos.map((todo) => todo.id),0) + 1;
const todoInstance: Todo = {
  userId: newTodo.userId!,
  id: todoId,
  title: newTodo.title || 'new Todo',
  completed: false
};
      this.todos.push(todoInstance);
  }

  deleteTodo(todoId:number){
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
    console.log(`Todo with id ${todoId} deleted`);
  } 

  editTodoById(todoId:number, updatedTodo:Partial<Todo>){
    const todo = this.todos.find((todo) => todo.id === todoId );
    if(!todo){
      throw new Error(`Todo with id ${todoId} not found`);
    }
    Object.assign(todo, updatedTodo);
  
    console.log(`Todo with id ${todoId} updated:`,todo);
  return todo;
  }
}
