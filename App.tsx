import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

// Define the type for a task list
type Task = {
  id: string;
  title: string;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]> ([
    { id: '1', title: 'Learn React Native' },
     { id: '2', title: 'Build a To-Do App'},
    ]);
const [taskTitle, setTaskTitle] = useState<string>('');

const addTask = () => {
  if (taskTitle.trim() !== '') {
    setTasks((prevTasks) => [
      ...prevTasks,
    { id: Date.now().toString(), title: taskTitle },
  ]);
  setTaskTitle('');
  }
};

return (
<SafeAreaView style={styles.container}>
  <Text style={styles.header}>Task List</Text>
  <FlatList
  data={tasks}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Text style={styles.task}>{item.title}</Text>}
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
});

export default App;



