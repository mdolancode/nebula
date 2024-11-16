import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

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

  // Add a new task
const addTask = () => {
  if (taskTitle.trim() !== '') {
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskTitle }),
    })
    .then((response) => response.json())
    .then((newTask: Task) => setTasks((prev) => [...prev, newTask]))
    .catch((error) => console.error('Error adding task:', error));

  setTaskTitle('');
  }
};

const deleteTask = (id: string) => {
  fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE'})
  .then(() => setTasks((prev) => prev.filter((task) => task.id !== id)))
  .catch((error) => console.error('Error deleting task:', error))
};

const toggleTaskCompletion = (id: string) => {
  fetch(`http://localhost:3000/tasks/${id}`, { method: 'PATCH'})
  .then((response) => response.json())
  .then((updatedTask: Task) => {
    setTasks((prev) => 
    prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  })
  .catch((error) => console.error('Error toggling task completion:', error));
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
<SafeAreaView style={styles.container}>
  <Text style={styles.header}>Task List</Text>
  <FlatList
  data={tasks}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={[
      styles.taskContainer, 
      item.id === selectedTaskId && styles.selectedTaskContainer]}
    >
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
    {item.title}</Text>
    <Button title="Delete" onPress={() => deleteTask(item.id)} />
    </View>
)}
/>
  <TextInput
  style={styles.input}
  placeholder="Add new task"
  value={taskTitle}
  onChangeText={setTaskTitle}
  />
  <Button title="Add Task" onPress={addTask} />
  <Button title="Pick Random Task" onPress={selectRandomTask} />
</SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f8f8f8'},
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 10, 
    marginBottom: 10, 
    marginLeft: 20 },
  task: { 
    padding: 10, 
    fontSize: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd' },
  input: { 
    height: 40, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    marginBottom: 10, 
    paddingHorizontal: 8 },
  taskContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd' },
  completedTask: { 
    textDecorationLine: 'line-through', 
    color: 'gray' },
  selectedTaskContainer: { 
    backgroundColor: '#d3f9d8', // light green background color 
    borderColor: '#28a745', // Green border 
    borderWidth: 1, // Green border width
  },
  selectedTaskText: { 
    fontWeight: 'bold',
    color: '#28a745'
 },
  
});

export default App;



