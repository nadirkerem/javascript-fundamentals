const { CourseInfo, AssignmentGroup, LearnerSubmissions } = require('./data');

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  try {
    // check if the course_id in the assignmentGroup matches the course_id in the courseInfo
    if (courseInfo.id !== assignmentGroup.course_id) {
      throw new Error('The input was invalid - course_id does not match.');
    }

    // create an array to store the result
    const result = [];

    // iterate over the learnerSubmissions
    for (let i = 0; i < learnerSubmissions.length; i++) {
      // check if the learner is already in the result array
      const learner = findLearner(result, learnerSubmissions[i].learner_id);

      // if the learner is in the result array, skip to the next iteration
      if (learner) {
        continue;
      }

      // if the learner is not in the result array, add the learner
      if (!learner) {
        result.push({
          id: learnerSubmissions[i].learner_id,
        });
      }
    }

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
              let score = calculateScore(submission, assignment);
              learner[assignment.id] = score;
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
      } else {
        learner.avg = 'N/A';
      }
    });

    return result;
  } catch (error) {
    console.log(error.message);
  }

  // helper functions for better readability

  // find a learner in the result array by id
  function findLearner(result, learnerId) {
    return result.find((learner) => learner.id === learnerId);
  }

  // calculate the score for a submission based on the assignment
  function calculateScore(submission, assignment) {
    const submittedAt = new Date(submission.submission.submitted_at);
    const dueAt = new Date(assignment.due_at);
    const isLate = submittedAt > dueAt;
    const pointsPossible = assignment.points_possible;
    const score = (
      (isLate
        ? submission.submission.score * 0.9
        : submission.submission.score) / pointsPossible
    ).toFixed(2);
    return score;
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
