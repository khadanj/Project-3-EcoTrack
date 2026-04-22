//this component shows a list of all logged activities database
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ActivityList.css';

const PAGE_SIZE = 10;

function ActivityList({ onEdit, refreshTrigger }) {
  // activities is the list from the database
  //starts as an empty array until the fetch is done
  const [activities, setActivities] = useState([]);

  // tracks what category users want to filter by
  //all wull show everything
  const [filterCategory, setFilterCategory] = useState('all');

  // which page of results is visible
  const [page, setPage] = useState(1);

  //fetch activities when the component first loads
  useEffect(
    function () {
      // backend already returns newest-first
      fetch('/api/activities')
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setActivities(Array.isArray(data) ? data : []);
        });
    },
    [refreshTrigger],
  );

  // this function runs when user clicks the delete button on an activity
  function handleDelete(id) {
    // show a browser confirm dialog before delete
    const confirmed = window.confirm(
      'Are you sure you want to delete this activity?',
    );
    // if the user clicked Cancel, stop here and don't delete
    if (!confirmed) return;

    // send a DELETE request to the backend with the activity id
    fetch('/api/activities/' + id, {
      method: 'DELETE',
    })
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        // after deleting, fetch the list again so the deleted item disappears
        fetch('/api/activities')
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            setActivities(Array.isArray(data) ? data : []);
          });
      });
  }

  // filter the activities based on the selected category
  // if filterCategory is 'all', show everything
  // otherwise only show activities that match the selected category
  const filteredActivities = activities.filter(function (activity) {
    if (filterCategory === 'all') return true;
    return activity.category === filterCategory;
  });

  // reset to first page whenever the filter or underlying list changes
  useEffect(
    function () {
      setPage(1);
    },
    [filterCategory, activities],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageItems = filteredActivities.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <section
      className="activity-list"
      aria-labelledby="activity-history-heading"
    >
      <h2 id="activity-history-heading">Activity History</h2>
      <p className="activity-list-description">
        View and manage your logged carbon-footprint activities. Filter by
        category, edit entries, or delete items you no longer need.
      </p>

      <div className="filter-bar">
        <label htmlFor="category-filter">Filter by category: </label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={function (e) {
            setFilterCategory(e.target.value);
          }}
        >
          <option value="all">All</option>
          <option value="transport">Transport</option>
          <option value="diet">Diet</option>
          <option value="energy">Energy</option>
        </select>
      </div>

      <ul>
        {pageItems.map(function (activity) {
          return (
            // each list item needs a unique key so react can keep track of it
            <li key={activity._id}>
              <span>{activity.date}</span>
              <span>{activity.type}</span>
              <span>{activity.category}</span>
              <span>
                {activity.value} {activity.unit}
              </span>
              <span>{activity.note}</span>

              <button
                type="button"
                onClick={function () {
                  onEdit(activity);
                }}
                aria-label={'Edit activity: ' + activity.type}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={function () {
                  handleDelete(activity._id);
                }}
                aria-label={'Delete activity: ' + activity.type}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      {filteredActivities.length === 0 && (
        <p className="no-results">No activities found for this category.</p>
      )}

      {filteredActivities.length > 0 && (
        <nav className="pagination" aria-label="Activity list pagination">
          <button
            type="button"
            onClick={function () {
              setPage(safePage - 1);
            }}
            disabled={safePage <= 1}
          >
            Previous
          </button>
          <span className="pagination-status" aria-live="polite">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={function () {
              setPage(safePage + 1);
            }}
            disabled={safePage >= totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

// define what props this component expects to receive
ActivityList.propTypes = {
  onEdit: PropTypes.func,
  refreshTrigger: PropTypes.number,
};

export default ActivityList;
