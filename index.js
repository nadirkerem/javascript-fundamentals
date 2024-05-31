// The provided course information.
const CourseInfo = {
  id: 451,
  name: 'Introduction to JavaScript',
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: 'Fundamentals of JavaScript',
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: 'Declare a Variable',
      due_at: '2023-01-25',
      points_possible: 50,
    },
    {
      id: 2,
      name: 'Write a Function',
      due_at: '2023-02-27',
      points_possible: 150,
    },
    {
      id: 3,
      name: 'Code the World',
      due_at: '3156-11-15',
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: '2023-01-25',
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: '2023-02-12',
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: '2023-01-25',
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: '2023-01-24',
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: '2023-03-07',
      score: 140,
    },
  },
];

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  try {
    // check if the course_id in the assignmentGroup matches the course_id in the courseInfo
    if (courseInfo.id !== assignmentGroup.course_id) {
      throw new Error('The input was invalid - course_id does not match.');
    }

    // create an array to store the result
    const result = [];

    learnerSubmissions.forEach((submission) => {
      // check if the learner is already in the result array
      const learner = findLearner(result, submission.learner_id);

      // if the learner is not in the result array, add the learner
      if (!learner) {
        result.push({
          id: submission.learner_id,
        });
      }
    });

    // iterate over the assignments in the assignmentGroup
    assignmentGroup.assignments.forEach((assignment) => {
      try {
        // check if points_possible is positive
        if (assignment.points_possible <= 0) {
          throw new Error(
            'The input was invalid - points_possible is not positive.'
          );
        }

        learnerSubmissions.forEach((submission) => {
          if (submission.assignment_id === assignment.id) {
            // find the learner in the result array
            const learner = findLearner(result, submission.learner_id);

            // if the learner exists, calculate the score and update the learner object
            if (learner) {
              learner[assignment.id] = (
                (new Date(submission.submission.submitted_at) >
                new Date(assignment.due_at)
                  ? parseFloat(submission.submission.score) * 0.9
                  : submission.submission.score) / assignment.points_possible
              ).toFixed(2);
            }
          }
        });
      } catch (error) {
        console.log(error.message);
      }
    });

    // iterate over the result array to calculate the average score
    result.forEach((learner) => {
      // filter out the assignment scores from the learner object
      const assignmentScores = Object.values(learner).filter(
        (value) => typeof value === 'string'
      );

      // calculate the average score if there are assignment scores
      if (assignmentScores.length > 0) {
        learner.avg = (
          assignmentScores.reduce((acc, score) => acc + parseFloat(score), 0) /
          assignmentScores.length
        ).toFixed(2);
      }
    });

    return result;
  } catch (error) {
    console.log(error.message);
  }

  function findLearner(result, learnerId) {
    return result.find((learner) => learner.id === learnerId);
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
