export interface StudentData {
    accountType: string;
    classes: Array<string>;
    email: string;
    gradeLevel: string;
    name: string;
    points: number;
    leaderBoardPoints: number;
    subjectPoints: {
        [subject: string]: number;
    };
    username: string;
    id: string;
  }
  
  export interface Classes {
    [className: string]: Array<string>;
  }
  
export interface TeacherData {
    accountType: string;
    classes: Classes;
    email: string;
    name: string;
    username: string;
  }
  