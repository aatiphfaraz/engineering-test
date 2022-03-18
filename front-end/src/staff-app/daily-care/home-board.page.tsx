import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import TextField from "@material-ui/core/TextField"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import  { useStudentsAttendanceContext } from "shared/context/useStudentsAttendanceContext"
import { MenuItem, Select, TableSortLabel } from "@material-ui/core"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveUsers] = useApi<{}>({ url: "save-roll" })
  const { renderStudentList, changeStudentList, saveStudentsAttendance, setSortingOrder, sortingOrder, resetStudentList } = useStudentsAttendanceContext();

useEffect(() => {
  if(data){
    changeStudentList(data.students)
  }
}, [data])

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if(action === "sort"){
      if (sortingOrder === 'asc') {
        setSortingOrder('desc')
      } else if (sortingOrder === 'desc') {
        setSortingOrder('asc')
      }
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if(action === "filter"){
    void saveUsers(saveStudentsAttendance())
    }
    resetStudentList()
    setIsRollMode(false)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} />
        <StudentsList
          loadState={loadState}
          renderStudentList={renderStudentList}
          isRollMode={isRollMode}
        />
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick } = props
  const { setFilter, setSortBy, sortBy, sortingOrder } = useStudentsAttendanceContext();

  return (
    <S.ToolbarContainer>
      <div>
      <S.Select
        value={sortBy}
        label="Sort By"
        onChange={(e) => setSortBy(e.target.value)}
      >
        <MenuItem value={'firstName'}>First Name</MenuItem>
        <MenuItem value={'lastName'}>Last Name</MenuItem>
      </S.Select>
      <S.TableSortLabel direction={sortingOrder} onClick={() => onItemClick("sort")}>{sortingOrder.toUpperCase()}</S.TableSortLabel>
      </div>
      <S.InputContainer>
      <TextField id="outlined-basic" placeholder="Search" size="small" variant="filled" onChange={(e) => setFilter(e.target.value)} />
      </S.InputContainer>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

interface IStudentListProps{
  loadState: string,
  renderStudentList: Person[],
  isRollMode?: boolean
  activityView?: boolean
}
export const StudentsList: React.FC<IStudentListProps> = (props) => {

  const { loadState, renderStudentList, isRollMode = true, activityView = false } = props;
  return <>
    {loadState === "loading" && (
      <CenteredContainer>
        <FontAwesomeIcon icon="spinner" size="2x" spin />
      </CenteredContainer>
    )}

    {loadState === "loaded" && renderStudentList && (
      <>
        {renderStudentList.map((s) => (
          <StudentListTile key={s.id} isRollMode={isRollMode} student={s} activityView={activityView}/>
        ))}
      </>
    )}

    {loadState === "error" && (
      <CenteredContainer>
        <div>Failed to load</div>
      </CenteredContainer>
    )}
  </>
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  Select: styled(Select)`
  && {
    color: white;
  }
`,
TableSortLabel: styled(TableSortLabel)`
&& {
  color: white;
}
`,
InputContainer: styled.div`
background: white;
`,
}
