import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome5'; 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  badgeCount: number;
  children: React.ReactNode;
}

export function Accordion({ title, badgeCount, children }: AccordionProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand} activeOpacity={0.8}>
        <View style={styles.titleRow}>
         
          <FontAwesome name={expanded ? "folder-open" : "folder"} size={16} color="#4B5563" style={{ marginRight: 12 }} />
          <Text style={styles.title}>{title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        </View>
        
        <FontAwesome name={expanded ? "chevron-up" : "chevron-down"} size={14} color="#6B7280" />
      </TouchableOpacity>
      
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
});