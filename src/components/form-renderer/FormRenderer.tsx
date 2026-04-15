import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox'; 
import { Field } from '../../store/useFormStore';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface FormRendererProps {
  title: string;
  fields: Field[];
  onSubmit: (answers: Record<string, any>, globalAttachments: string[]) => void;  
}

export function FormRenderer({ title, fields, onSubmit }: FormRendererProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const [globalAttachments, setGlobalAttachments] = useState<string[]>([]);

  const [showDatePicker, setShowDatePicker] = useState<string | null> (null);

  const handleAnswerChange = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handlePickGlobalImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setGlobalAttachments((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleRemoveGlobalImage = (uri: string) => {
    setGlobalAttachments((prev) => prev.filter(item => item !== uri));
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder="Digite sua resposta..."
            value={answers[field.id] || ''}
            onChangeText={(text) => handleAnswerChange(field.id, text)}
            style={styles.fieldInput}
          />
        );
      case 'number':
        return (
          <Input
            placeholder="0"
            keyboardType="numeric"
            value={answers[field.id] || ''}
            onChangeText={(text) => handleAnswerChange(field.id, text)}
            style={styles.fieldInput}
          />
        );
      case 'boolean':
      return (
          <Checkbox
            label={answers[field.id] ? 'Confirmado' : 'Marcar para confirmar'}
            checked={!!answers[field.id]}
            onPress={() => handleAnswerChange(field.id, !answers[field.id])}
          />
        );

        case 'date':

        const currentDate = answers[field.id] ? new Date(answers[field.id]) : new Date();

            return(
               <View>
            {/* O Botão que o usuário clica para abrir o calendário */}
            <TouchableOpacity 
              style={styles.datePickerBtn} 
              onPress={() => setShowDatePicker(field.id)}
            >
              <FontAwesome name="calendar-alt" size={16} color="#4B5563" />
              <Text style={styles.datePickerText}>
                {answers[field.id] ? currentDate.toLocaleDateString('pt-BR') : 'Selecionar uma data...'}
              </Text>
            </TouchableOpacity>

            {/* O Calendário nativo invisível que só aparece quando o estado permite */}
            {showDatePicker === field.id && (
              <DateTimePicker
                value={currentDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(null); // Esconde o calendário ao selecionar
                  if (event.type === 'set' && selectedDate) {
                    handleAnswerChange(field.id, selectedDate.toISOString());
                  }
                }}
              />
            )}
          </View>
            );

      default:
        return null;
    }
  };

  
  return (
    <View style={styles.screenContainer}>
      {/* <Text style={styles.screenTitle}>{title}</Text> */}
      
      {fields.map((field) => (
        <View key={field.id} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {field.label} {field.required && <Text style={styles.required}>*</Text>}
          </Text>
          {renderField(field)}
        </View>
      ))}
  
      <View style={styles.attachmentsSection}>
        <Text style={styles.attachmentsTitle}>Anexos Gerais / Fotos do Ambiente</Text>
        
        {globalAttachments.length > 0 && (
          <FlatList
            data={globalAttachments}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.attachmentList}
            renderItem={({ item }) => (
              <View style={styles.attachmentCard}>
                <Image source={{ uri: item }} style={styles.attachmentImage} />
                <TouchableOpacity style={styles.removeBadge} onPress={() => handleRemoveGlobalImage(item)}>
                  <Text style={styles.removeBadgeText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        
        <TouchableOpacity style={styles.addAttachmentBtn} onPress={handlePickGlobalImage}>
          <Text style={styles.addAttachmentBtnText}> Anexar Arquivo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.submitContainer}>
        <Button 
          label="Enviar" 
          onPress={() => onSubmit(answers, globalAttachments)} 
          style={styles.submitBtn} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: 'white', 
    flex: 1,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#DC2626',
  },
  fieldInput: {
    marginBottom: 0,
  },
  submitContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    width: '100%', 
    maxWidth: 300, // Limita largura em tablets
  },
  
  attachmentsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  attachmentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  attachmentList: {
    gap: 12,
    paddingBottom: 16,
  },
  attachmentCard: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
  addAttachmentBtn: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#818CF8',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addAttachmentBtnText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  removeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(220, 38, 38, 0.8)', // Vermelho translúcido
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  datePickerText: {
    fontSize: 16,
    color: '#374151',
  },
});