import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { catchError, map, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

const API_URL = '  https://jsonplaceholder.typicode.com/users';
@Injectable({
  providedIn: 'root',
})
export class UserService {
    private users: User[] = [];
  private _httpclient = inject(HttpClient);

  getUsers(): User[] {
    return this.users;
  }

  fetchUsers(): Observable<User[]> {
    return this._httpclient.get<User[]>(API_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching users:', error);
        throw new Error('Error occured while fetching users');
      })
    );
  }

  findUsersById(id:number):Observable<User | undefined>{
    return this._httpclient.get<User[]>(`${API_URL}/${id}`).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.error(`Error fetching user with id ${id}:`, error);
        throw new Error(`Error occurred while fetching user with id ${id}`);
      }),
      map((users) => (users.length > 0 ? users[0] : undefined))
    );
  }
}
