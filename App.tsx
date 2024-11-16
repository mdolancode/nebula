import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

// Define the type for a task list
type Task = {
  id: string;
  title: string;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]> ([]);
  const [taskTitle, setTaskTitle] = useState<string>('');

  // Fetch tasks from the backend
  useEffect(() => {
    fetch('http://localhost:3000/tasks')
    .then((response) => response.json())
    .then((data: Task[]) => setTasks(data))
    .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

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
  fetch('http://localhost:3000/tasks/${id', { method: 'DELETE'})
  .then(() => setTasks((prev) => prev.filter((task) => task.id !== id)))
  .catch((error) => console.error('Error deleting task:', error))
};

return (
<SafeAreaView style={styles.container}>
  <Text style={styles.header}>Task List</Text>
  <FlatList
  data={tasks}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.taskContainer}>
    <Text style={styles.task}>{item.title}</Text>
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
</SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8'},
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 10, marginBottom: 10, marginLeft: 20 },
  task: { padding: 10, fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
  taskContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  task: { fontSize: 18,}
});

export default App;



