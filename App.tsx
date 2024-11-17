import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Image, Modal } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import CheckBox from '@react-native-community/checkbox';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Define the type for a task list
type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]> ([]);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false); // For modal visibility
  const swipeListRef = useRef<SwipeListView<Task>>(null); // Add this ref to the SwipeListView component

  // Fetch tasks from the backend
  useEffect(() => {
    fetch('http://localhost:3000/tasks')
    .then((response) => response.json())
    .then((data: Task[]) => setTasks(data))
    .catch((error) => console.error('Error fetching tasks:', error));
  }, 
[]);

useEffect(() => {
  if (selectedTaskId) {
    const timer = setTimeout(() => setSelectedTaskId(null), 5000);
    return () => clearTimeout(timer);
  }
}, [selectedTaskId]);

const sortTasks = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => Number(a.completed) - Number(b.completed));
}

const validateAndAddTask = () => {
  if (taskTitle.trim() === '') {
    Alert.alert('Input Error', 'Task title cannot be empty.'); // Alert for empty input
    return;
  }
  addTask();
};

  // Add a new task
const addTask = () => {


    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskTitle, completed: false }),
    })
    .then((response) => response.json())
    .then((newTask: Task) => { 
      setTasks((prev) => [...prev, newTask]);
      setTaskTitle('');
      setModalVisible(false); // Close modal
  })
    .catch((error: Error) => console.error('Error adding task:', error));
};
// Delete a Task
const deleteTask = (id: string) => {
  // Close all open rows before making the delete request
  if (swipeListRef.current) {
    swipeListRef.current.closeAllOpenRows();
  }
  fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE'})
  .then(() => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  })
  .catch((error) => console.error('Error deleting task:', error))
};

const toggleTaskCompletion = (id: string) => {
  fetch(`http://localhost:3000/tasks/${id}`, { method: 'PATCH'})
  .then((response) => response.json())
  .then((updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
  );
})
  .catch((error) => 
    console.error('Error toggling task completion:', error));
};

const selectRandomTask = () => {
  const incompleteTasks = tasks.filter((task) => !task.completed);

  if (incompleteTasks.length > 0) {
    const randomIndex = Math.floor(Math.random() * incompleteTasks.length);
    const randomTask = incompleteTasks[randomIndex];
    setSelectedTaskId(randomTask.id); // Highlight this task
  } else {
    setSelectedTaskId(null);
    Alert.alert('No Tasks', 'No tasks available to select');
  }
};

return (
<GestureHandlerRootView>
  <SafeAreaView style={styles.container}>
    <Text style={styles.header}>Task List</Text>
<View style={styles.taskListContainer}>
    {/* Task List */}
    <SwipeListView
      ref={swipeListRef}
      data={tasks.slice().sort((a, b) => Number(a.completed) - Number(b.completed))}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[
          styles.taskContainer, 
          item.id === selectedTaskId && styles.selectedTaskContainer]}
        >
        {/* Checkbox */}
        <CheckBox
          value={item.completed}
          onValueChange={() => toggleTaskCompletion(item.id)}
        />
      <Text style={[
        styles.task,
      item.completed && styles.completedTask,
      item.id === selectedTaskId && styles.selectedTaskText,
    ]}
    >
      
        {item.title}
      </Text>
    </View>
  )}
  renderHiddenItem={({ item }) => ( 
    <TouchableOpacity
    style={styles.hiddenContainer}
    onPress={() => deleteTask(item.id)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>

  )}
  rightOpenValue={-75}
  disableRightSwipe={true}
  showsVerticalScrollIndicator={false}
/>
</View>
  {/* Floating Buttons */}  
<View style={styles.floatingButtons}>
  {/* Add Task Button */}
  <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
    <Image source={require('./assets/icons/add-light.png')} style={styles.icon} /> 
  </TouchableOpacity>

  {/* Random Task Button */}
  <TouchableOpacity style={[styles.fab, styles.randomButton]} onPress={selectRandomTask}>
    <Image source={require('./assets/icons/random-light.png')} style={styles.icon} />
  </TouchableOpacity>
</View>
  {/* Modal for Adding Tasks*/}
<Modal visible={modalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Add New Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={validateAndAddTask}>
        <Text style={styles.saveButtonText}>Save Task</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

</View>
</View>
</Modal>
  </SafeAreaView>
</GestureHandlerRootView>
);
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f8f8f8',
  },
  taskListContainer: { 
    flex: 1,
    marginBottom: 145, // Space for floating buttons 
    paddingBottom: 10, // Space between tasks and floating buttons
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 10, 
    marginLeft: 20, 
  },
  task: { 
    flex: 1,
    padding: 10, 
    fontSize: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd',
  },
  taskContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 10, // Adds consistent vertical padding
    paddingHorizontal: 15, // Adds consistent horizontal padding
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
    backgroundColor: 'white', // Ensures tasks have a white background
  },
  completedTask: { 
    textDecorationLine: 'line-through', 
    color: 'gray' 
  },
  selectedTaskContainer: { 
    backgroundColor: '#d3f9d8', // light green background color 
    borderColor: '#28a745', // Green border 
    borderWidth: 1, // Green border width
  },
  selectedTaskText: { 
    fontWeight: 'bold',
    color: '#28a745'
  },
  hiddenContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'red',
    paddingRight: 15,
    height: '100%', // Ensure it matches the task container height
    width: '100%', // Ensure it matches the task container width
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 5,
    textAlign: 'right',
    width: 75, // Match rightOpenValue
    lineHeight: 45, // Match task height
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 75,
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  fab: {
    backgroundColor: 'transparent',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Space between buttons
  },
  randomButton: {
    backgroundColor: 'transparent',
  },
  icon: {
    width: 60,
    height: 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    paddingVertical: 10, // Consistent vertical padding
    paddingHorizontal: 20, // Base horizontal padding
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#28a745', // Green
    minWidth: 120, // Ensures buttons are at least this wide
    paddingHorizontal: 20, // Extra padding for visual balance
  },
  cancelButton: {
    backgroundColor: '#dc3545', // Red
    minWidth: 120, // Ensures buttons are at least this wide
    paddingHorizontal: 30, // Extra padding for visual balance
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;



