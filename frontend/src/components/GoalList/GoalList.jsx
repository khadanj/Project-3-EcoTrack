//this component shows a list of all goals from the database
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './GoalList.css';

function GoalList({ onEdit, refreshTrigger }) {
  // goals is the list from the database
  //starts as an empty array until the fetch is done
  const [goals, setGoals] = useState([]);

  //fetch goals when the component first loads
  useEffect(
    function () {
      fetch('/api/goals')
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (!Array.isArray(data)) {
            setGoals([]);
            return;
          }
          const sorted = data.sort(function (a, b) {
            return new Date(b.deadline) - new Date(a.deadline);
          });
          setGoals(sorted);
        });
    },
    [refreshTrigger],
  );

  // this function runs when user clicks the delete button on a goal
  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this goal?',
    );
    if (!confirmed) return;

    fetch('/api/goals/' + id, {
      method: 'DELETE',
    })
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        fetch('/api/goals')
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (!Array.isArray(data)) {
              setGoals([]);
              return;
            }
            const sorted = data.sort(function (a, b) {
              return new Date(b.deadline) - new Date(a.deadline);
            });
            setGoals(sorted);
          });
      });
  }

  return (
    <section className="goal-list" aria-labelledby="my-goals-heading">
      <h2 id="my-goals-heading">My Goals</h2>
      <p className="goal-list-description">
        Track the carbon-reduction goals you have set. Edit to update progress
        or remove goals once they are no longer relevant.
      </p>

      <ul>
        {goals.map(function (goal) {
          return (
            // each list item needs a unique key so react can keep track of it
            <li key={goal._id}>
              <span className="goal-title">{goal.title}</span>
              <span>{goal.category}</span>
              <span>
                {goal.targetValue} {goal.targetUnit}
              </span>
              <span>{goal.deadline}</span>
              <span className={'goal-status goal-status-' + goal.status}>
                {goal.status}
              </span>
              <span>{goal.note}</span>

              <button
                type="button"
                onClick={function () {
                  onEdit(goal);
                }}
                aria-label={'Edit goal: ' + goal.title}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={function () {
                  handleDelete(goal._id);
                }}
                aria-label={'Delete goal: ' + goal.title}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      {goals.length === 0 && (
        <p className="no-results">
          You have no goals yet. Use the form to create your first one.
        </p>
      )}
    </section>
  );
}

// define what props this component expects to receive
GoalList.propTypes = {
  onEdit: PropTypes.func,
  refreshTrigger: PropTypes.number,
};

export default GoalList;
