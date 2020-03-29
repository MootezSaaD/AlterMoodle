import { Assignment } from "./assignment.model";
import { Course } from "./course.model";

export interface CourseAssignment {
  _id: string;
  courseInfo: Course;
  assignment: Assignment[];
}
