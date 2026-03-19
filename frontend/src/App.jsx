// main app component
import { useState } from 'react'
import ActivityList from './components/ActivityList/ActivityList'
import ActivityForm from './components/ActivityForm/ActivityForm'
import './index.css'

function App() {

  //keeps track of activity user clicked 'edit' on
  //starts at null
  const [selectedActivity, setSelectedActivity] = useState(null)

  // number increases every time user saves or delete
  //ActivityList watches this number and re-fetches when it changes
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  //when user clicks edit on an activity, save it to state
  function handleEdit(activity) {
    setSelectedActivity(activity)
  }

  //when form saves, clear selected activity
  function handleSave() {
    setSelectedActivity(null)
    setRefreshTrigger(refreshTrigger + 1)
  }

  return (
    <div>
      <h1>EcoTrack</h1>
      <ActivityForm selectedActivity={selectedActivity} onSave={handleSave} />
      <ActivityList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
