// this component handles creating a new activity and editing an existing one
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ActivityForm.css';

function ActivityForm({ selectedActivity, onSave }) {
  // one state variable for each form field
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  // when selectedActivity changes it means the user clicked edit
  useEffect(
    function () {
      if (selectedActivity) {
        setType(selectedActivity.type);
        setCategory(selectedActivity.category);
        setValue(selectedActivity.value);
        setUnit(selectedActivity.unit);
        setDate(selectedActivity.date);
        setNote(selectedActivity.note);
      } else {
        // if no activity is selected clear the form
        setType('');
        setCategory('');
        setValue('');
        setUnit('');
        setDate('');
        setNote('');
      }
    },
    [selectedActivity],
  );

  // this function runs when the user clicks the save button
  function handleSubmit(e) {
    // prevent the page from refreshing when the form is submitted
    e.preventDefault();

    // put all the form field values into one object
    const activityData = {
      type: type,
      category: category,
      value: value,
      unit: unit,
      date: date,
      note: note,
    };

    // if selectedActivity has an id it means an exisiting activity is being edited
    // if not, create a new one
    if (selectedActivity) {
      // send a PUT request to update the existing activity
      fetch('/api/activities/' + selectedActivity._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function () {
          // tell the parent component to save
          onSave();
        });
    } else {
      // send a POST request to create a new activity
      fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function () {
          // tell the parent component to save
          onSave();
        });
    }
  }

  return (
    <div className="activity-form">
      <h2>{selectedActivity ? 'Edit Activity' : 'Log New Activity'}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Type: </label>
          <input
            type="text"
            placeholder="e.g. driving, flying, beef"
            value={type}
            onChange={function (e) {
              setType(e.target.value);
            }}
          />
        </div>

        <div>
          <label>Category: </label>
          <input
            type="text"
            placeholder="e.g. transport, diet, energy"
            value={category}
            onChange={function (e) {
              setCategory(e.target.value);
            }}
          />
        </div>

        <div>
          <label>Value: </label>
          <input
            type="number"
            placeholder="e.g. 30"
            value={value}
            onChange={function (e) {
              setValue(e.target.value);
            }}
          />
        </div>

        <div>
          <label>Unit: </label>
          <input
            type="text"
            placeholder="e.g. miles, servings"
            value={unit}
            onChange={function (e) {
              setUnit(e.target.value);
            }}
          />
        </div>

        <div>
          <label>Date: </label>
          <input
            type="date"
            value={date}
            onChange={function (e) {
              setDate(e.target.value);
            }}
          />
        </div>

        <div>
          <label>Note: </label>
          <input
            type="text"
            placeholder="e.g. drove to class"
            value={note}
            onChange={function (e) {
              setNote(e.target.value);
            }}
          />
        </div>

        <button type="submit">
          {selectedActivity ? 'Update Activity' : 'Save Activity'}
        </button>

        {selectedActivity && (
          <button type="button" onClick={onSave}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

// define what props this component expects
ActivityForm.propTypes = {
  selectedActivity: PropTypes.object,
  onSave: PropTypes.func,
};

export default ActivityForm;
