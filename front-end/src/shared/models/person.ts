import { RolllStateType } from "./roll"

export interface Person {
  id: number
  first_name: string
  last_name: string
  photo_url?: string
  attandance_status?: RolllStateType
}

export const PersonHelper = {
  getFullName: (p: Person) => `${p.first_name} ${p.last_name}`,
  searchData: (searchParam: string, items: Person[]) => {
    return items.filter(
      (person: Person) => {
        return (
          person
            .first_name
            .toLowerCase()
            .includes(searchParam.toLowerCase()) ||
          person
            .last_name
            .toLowerCase()
            .includes(searchParam.toLowerCase())
        );
      }
    );
  },
  sortData: (items: Person[], sortBy: 'firstName' | 'lastName', order: 'asc' | 'desc'): Person[] => {
    if (sortBy === 'firstName') {
      return items.sort(function(a, b) {
        if(a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
          return (order === 'asc') ? -1 : 1
        }
        if(a.first_name.toLowerCase() > b.first_name.toLowerCase()) { 
          return (order === 'asc') ? 1 : -1

        }
        return 0;
       })
    } else if (sortBy === 'lastName') {
      return items.sort(function (a, b) {
        if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) {
          return (order === 'asc') ? -1 : 1
        }
        if (a.last_name.toLowerCase() > b.last_name.toLowerCase()) {
          return (order === 'asc') ? 1 : -1
        }
        return 0;
      })
        .map((item, i) => item)
    } else {
      return items;
    }
  }
}
