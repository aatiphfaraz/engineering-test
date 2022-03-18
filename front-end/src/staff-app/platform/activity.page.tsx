import React, { useEffect } from "react"
import styled from "styled-components"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { Activity } from "shared/models/activity"
import { useApi } from "shared/hooks/use-api"
import { StudentsList } from "staff-app/daily-care/home-board.page"
import { Colors } from "shared/styles/colors"

export const ActivityPage: React.FC = () => {
  const [getStudentsAttendance, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  useEffect(() => {
    void getStudentsAttendance()
  }, [getStudentsAttendance])

  return <S.Container>
    <S.ToolbarContainer>Activity Page</S.ToolbarContainer>
    {
      data?.activity.map((attendance) => {
        return <div key={attendance.date.toString()}>
          <S.AttendanceDateContainer>
            {attendance.date}
          </S.AttendanceDateContainer>
          <StudentsList
            loadState={loadState}
            renderStudentList={attendance.entity.student_roll_states}
            activityView={true}
          />
        </div>
      })
    }
  </S.Container>
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  ToolbarContainer: styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  background-color: ${Colors.blue.base};
  padding: 12px 14px;
  font-weight: ${FontWeight.strong};
  border-radius: ${BorderRadius.default};
`,
AttendanceDateContainer:  styled.div`
margin-top: 12px;
display: flex;
justify-content: space-between;
align-items: center;
color: #fff;
background-color: ${Colors.dark.lighter};
padding: 12px 14px;
font-weight: ${FontWeight.strong};
border-radius: ${BorderRadius.default};
`,
}
