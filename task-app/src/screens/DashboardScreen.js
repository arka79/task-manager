import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../config/config';

export default function DashboardScreen({ setToken, user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/tasks/${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Fetch Tasks Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      Alert.alert('Validation Error', 'Please enter a task title');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.trim(),
          description: newTaskDescription.trim(),
          userId: token,
          status: 'pending'
        })
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks([createdTask, ...tasks]);
        setNewTask('');
        setNewTaskDescription('');
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Add Task Error:', error);
      Alert.alert('Error', 'Unable to add task');
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setTasks(tasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        ));
      }
    } catch (error) {
      console.error('Update Task Error:', error);
      Alert.alert('Error', 'Unable to update task');
    }
  };

  const deleteTask = async (taskId) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
              setTasks(tasks.filter(task => task._id !== taskId));
            }
          } catch (error) {
            console.error('Delete Task Error:', error);
            Alert.alert('Error', 'Unable to delete task');
          }
        }
      }
    ]);
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userName');
            await SecureStore.deleteItemAsync('userEmail');
            setToken(null);
          } catch (error) {
            console.error('Logout Error:', error);
          }
        }
      }
    ]);
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity
        onPress={() => toggleTaskStatus(item._id, item.status)}
        style={[
          styles.checkIcon,
          item.status === 'completed' && styles.checkIconCompleted
        ]}
      >
        {item.status === 'completed' && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            item.status === 'completed' && styles.taskTitleCompleted
          ]}
        >
          {item.title}
        </Text>
        {item.description && (
          <Text style={styles.taskDescription}>{item.description}</Text>
        )}
        <Text style={styles.taskTime}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => deleteTask(item._id)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.headerTitle}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>🚪</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        >
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.statsCard}>
            <Text style={styles.statsTitle}>Daily Progress</Text>
            <View style={styles.progressRow}>
              <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${completionPercentage}%` }]} />
              </View>
              <Text style={styles.percentText}>{completionPercentage}%</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tasks.length}</Text>
                <Text style={styles.statLabel}>Total Tasks</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedCount}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tasks.length - completedCount}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>
              {tasks.length === 0 ? 'No Tasks Yet' : 'Your Tasks'}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📝</Text>
              <Text style={styles.emptyStateText}>
                Create your first task to get started
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.emptyStateBtn}
              >
                <Text style={styles.emptyStateBtnText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={tasks}
              renderItem={renderTaskItem}
              keyExtractor={item => item._id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </ScrollView>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Task</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Task title"
                placeholderTextColor="#94A3B8"
                value={newTask}
                onChangeText={setNewTask}
                style={styles.modalInput}
              />

              <TextInput
                placeholder="Description (optional)"
                placeholderTextColor="#94A3B8"
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                style={[styles.modalInput, styles.modalTextarea]}
                multiline
              />

              <TouchableOpacity
                onPress={addTask}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    paddingTop: Platform.OS === 'android' ? 40 : 10
  },
  headerContent: {
    flex: 1
  },
  welcomeText: {
    color: '#64748B',
    fontSize: 14
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4
  },
  logoutBtn: {
    width: 45,
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  logoutBtnText: {
    fontSize: 20
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 30
  },
  statsCard: {
    padding: 20,
    borderRadius: 25,
    marginBottom: 25
  },
  statsTitle: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 15
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4
  },
  barFill: {
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4
  },
  percentText: {
    color: '#FFF',
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 16
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800'
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B'
  },
  addBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14
  },
  taskCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkIconCompleted: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1'
  },
  checkmark: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  taskContent: {
    flex: 1
  },
  taskTitle: {
    fontWeight: '700',
    color: '#1E293B',
    fontSize: 16
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8'
  },
  taskDescription: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4
  },
  taskTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6
  },
  deleteBtn: {
    padding: 5,
    marginLeft: 10
  },
  deleteBtnText: {
    fontSize: 18,
    color: '#E63946'
  },
  separator: {
    height: 10
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyStateEmoji: {
    fontSize: 60,
    marginBottom: 15
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center'
  },
  emptyStateBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10
  },
  emptyStateBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B'
  },
  modalCloseBtn: {
    fontSize: 24,
    color: '#64748B'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F1F5F9',
    color: '#1E293B',
    fontSize: 16
  },
  modalTextarea: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  modalButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16
  }
});