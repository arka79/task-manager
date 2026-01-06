import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default function TaskCard({
  title,
  description = null,
  dueDate = null,
  status = 'pending',
  onToggle = null,
  onDelete = null,
  onPress = null
}) {
  const isCompleted = status === 'completed';

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, isCompleted && styles.completedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          isCompleted && styles.checkboxCompleted
        ]}
        onPress={onToggle}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            isCompleted && styles.completedTitle
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {description && (
          <Text
            style={styles.description}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        {dueDate && (
          <Text style={styles.dueDate}>
            {formatDate(dueDate)}
          </Text>
        )}
      </View>

      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  completedContainer: {
    backgroundColor: '#F1F5F9'
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  checkboxCompleted: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1'
  },
  checkmark: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14
  },
  contentContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#94A3B8'
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
    lineHeight: 18
  },
  dueDate: {
    fontSize: 12,
    color: '#94A3B8'
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#E63946',
    fontWeight: '600'
  }
});
