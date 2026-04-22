// this component handles creating a new goal and editing an existing one
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './GoalForm.css';

function GoalForm({ selectedGoal, onSave }) {
  // one state variable for each form field
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [targetUnit, setTargetUnit] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('active');
  const [note, setNote] = useState('');

  // stores the popup message to show after saving
  const [confirmMessage, setConfirmMessage] = useState('');

  // when selectedGoal changes it means the user clicked edit
  useEffect(
    function () {
      if (selectedGoal) {
        setTitle(selectedGoal.title);
        setCategory(selectedGoal.category);
        setTargetValue(selectedGoal.targetValue);
        setTargetUnit(selectedGoal.targetUnit);
        setDeadline(selectedGoal.deadline);
        setStatus(selectedGoal.status);
        setNote(selectedGoal.note);
      } else {
        resetForm();
      }
    },
    [selectedGoal],
  );

  function resetForm() {
    setTitle('');
    setCategory('');
    setTargetValue('');
    setTargetUnit('');
    setDeadline('');
    setStatus('active');
    setNote('');
  }

  function showConfirm(message) {
    setConfirmMessage(message);
    setTimeout(function () {
      setConfirmMessage('');
    }, 3000);
  }

  // this function runs when the user clicks the save button
  function handleSubmit(e) {
    // prevent the page from refreshing when the form is submitted
    e.preventDefault();

    // put all the form field values into one object
    const goalData = {
      title: title,
      category: category,
      targetValue: targetValue,
      targetUnit: targetUnit,
      deadline: deadline,
      status: status,
      note: note,
    };

    // if selectedGoal has an id it means an existing goal is being edited
    // if not, create a new one
    if (selectedGoal) {
      fetch('/api/goals/' + selectedGoal._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function () {
          showConfirm('Goal updated successfully!');
          onSave();
        });
    } else {
      fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function () {
          resetForm();
          showConfirm('Goal saved successfully!');
          onSave();
        });
    }
  }

  return (
    <div className="goal-form">
      <h2>{selectedGoal ? 'Edit Goal' : 'Create New Goal'}</h2>

      <div role="status" aria-live="polite" className="confirm-message-region">
        {confirmMessage && <p className="confirm-message">{confirmMessage}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="goal-title">Title: </label>
          <input
            id="goal-title"
            type="text"
            placeholder="e.g. Reduce meat consumption by 20%"
            value={title}
            onChange={function (e) {
              setTitle(e.target.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="goal-category">Category: </label>
          <input
            id="goal-category"
            type="text"
            placeholder="e.g. transport, diet, energy"
            value={category}
            onChange={function (e) {
              setCategory(e.target.value);
            }}
          />
        </div>

        <div className="form-row">
          <div className="form-row-field form-row-value">
            <label htmlFor="goal-target-value">Target Value: </label>
            <input
              id="goal-target-value"
              type="number"
              placeholder="e.g. 20"
              value={targetValue}
              onChange={function (e) {
                setTargetValue(e.target.value);
              }}
            />
          </div>

          <div className="form-row-field form-row-unit">
            <label htmlFor="goal-target-unit">Target Unit: </label>
            <input
              id="goal-target-unit"
              type="text"
              placeholder="e.g. %, miles, servings"
              value={targetUnit}
              onChange={function (e) {
                setTargetUnit(e.target.value);
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="goal-deadline">Deadline: </label>
          <input
            id="goal-deadline"
            type="date"
            value={deadline}
            onChange={function (e) {
              setDeadline(e.target.value);
            }}
          />
        </div>

        <div>
          <label htmlFor="goal-status">Status: </label>
          <select
            id="goal-status"
            value={status}
            onChange={function (e) {
              setStatus(e.target.value);
            }}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="goal-note">Note: </label>
          <input
            id="goal-note"
            type="text"
            placeholder="e.g. monthly target"
            value={note}
            onChange={function (e) {
              setNote(e.target.value);
            }}
          />
        </div>

        <button type="submit">
          {selectedGoal ? 'Update Goal' : 'Save Goal'}
        </button>

        {selectedGoal && (
          <button type="button" onClick={onSave}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

// define what props this component expects
GoalForm.propTypes = {
  selectedGoal: PropTypes.object,
  onSave: PropTypes.func,
};

export default GoalForm;
