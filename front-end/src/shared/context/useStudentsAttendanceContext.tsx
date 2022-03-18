import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useDebounce from "shared/hooks/use-debounce";
import { Person, PersonHelper } from "shared/models/person";
import { RollInput, RolllStateType } from "shared/models/roll";
import { ItemType } from "staff-app/components/roll-state/roll-state-list.component";
interface IStudentAttendanceContext {
    renderStudentList: Person[],
    studentsList: Person[],
    changeStudentList: (list: Person[]) => void,
    setFilter: (value: string) => void,
    handleAttendanceStatusChange: (id: number, status: RolllStateType) => void
    statusTypeCounter: any
    setAttendanceType: (type: ItemType) => void
    saveStudentsAttendance: () => RollInput
    setSortingOrder: (order: 'asc' | 'desc') => void,
    setSortBy: (sortBy: 'firstName' | 'lastName') => void,
    sortBy: 'asc' | 'desc',
    sortingOrder: 'firstName' | 'lastName',
    resetStudentList: () => void,
}

export const StudentAttendanceContext = createContext<IStudentAttendanceContext | any>(null);

export const useStudentsAttendanceContext = () => useContext(StudentAttendanceContext);
interface IStudentAttendanceContextProps {
    children: React.ReactNode
}

const initialCounter = {
    all: 0,
    present: 0,
    late: 0,
    absent: 0,
}

export default function StudentAttendanceContextProvider(props: IStudentAttendanceContextProps) {
    const { children } = props;
    const [studentsList, setStudentsList] = useState<Person[]>([]);
    const [filter, setFilter] = useState<string>('')
    const debouncedFilter = useDebounce(filter)
    const [filteredStudenstsList, setFilteredStudentsList] = useState<Person[]>([]);
    const [statusTypeCounter, setStatusTypeCounter] = useState(initialCounter)
    const [attendanceType, setAttendanceType] = useState<ItemType>('all')
    const [sortBy, setSortBy] = useState<'firstName' | 'lastName'>('firstName')
    const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc')


    const filterListType = useCallback((list: Person[]) => {
        const listType = list.filter((student) => {
            return student.attendance_status === attendanceType
        });
        return listType
    }, [attendanceType])

    const renderStudentList = useMemo(() => {
        const list = debouncedFilter ? filteredStudenstsList : studentsList
        const filterList = attendanceType !== 'all'
        return filterList ? filterListType(list) : list
    }, [debouncedFilter, filteredStudenstsList, studentsList, attendanceType])

    useEffect(() => {
        if (debouncedFilter) {
            setFilteredStudentsList(PersonHelper.searchData(debouncedFilter, studentsList))
        }
    }, [debouncedFilter])

    useEffect(() => {
        setFilteredStudentsList(PersonHelper.sortData(studentsList, sortBy, sortingOrder))
    }, [sortingOrder, sortBy])

    useEffect(() => {
        const counter = { ...initialCounter };
        studentsList.forEach((student: Person) => {
            switch (student.attendance_status) {
                case 'present':
                    counter.present += 1;
                    break;
                case 'absent':
                    counter.absent += 1;
                    break;
                case 'late':
                    counter.late += 1;
                    break;
            }
            counter.all = studentsList.length;
            setStatusTypeCounter(counter);
        });
    }, [studentsList])

    const handleAttendanceStatusChange = (id: number, status: RolllStateType) => {
        setStudentsList((prevState: any) => {
            return prevState.map((student: Person) => {
                if (student.id === id) {
                    student.attendance_status = status
                }
                return student;
            });
        });
    }

    const saveStudentsAttendance = (): RollInput => {
        const req = studentsList.filter((student) => {
            return student.attendance_status !== 'unmark'
        });
        return { student_roll_states: req }
    }

    const changeStudentList = (list:Person[]) => {
        setStudentsList(PersonHelper.sortData(list, sortBy, sortingOrder))
    }

    const resetStudentList = () => {
        const resetList = studentsList.map((student)=>{
            student.attendance_status = 'unmark'
            return student
        })
        changeStudentList(resetList)
    }

    const value = { handleAttendanceStatusChange, changeStudentList, setFilter,
         renderStudentList, studentsList, statusTypeCounter, setAttendanceType,
         saveStudentsAttendance, setSortingOrder, setSortBy, sortBy, sortingOrder, 
         resetStudentList }

    return <StudentAttendanceContext.Provider value={value}> {children} </StudentAttendanceContext.Provider>
}

