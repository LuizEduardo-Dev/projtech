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
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface FormRendererProps {
  title: string;
  fields: Field[];
  onSubmit: (answers: Record<string, any>, globalAttachments: string[]) => void;
}

export function FormRenderer({ title, fields, onSubmit }: FormRendererProps) {

  const [globalAttachments, setGlobalAttachments] = useState<string[]>([]);

  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);

  const buildDynamicSchema = (fields: Field[]) => {
    const schemaShape: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      if (field.required) {
        if (field.type === 'text') {
          schemaShape[field.id] = z.string({ message: 'Este campo é obrigatório.' }).min(1, 'Este campo é obrigatório.');
        } else if (field.type === 'number') {
          schemaShape[field.id] = z.string({ message: 'Valor numérico obrigatório.' }).min(1, 'Valor numérico obrigatório.');
        } else if (field.type === 'date') {
          schemaShape[field.id] = z.string({ message: 'Data obrigatória.' }).min(1, 'Data obrigatória.');
        } else if (field.type === 'boolean') {
          schemaShape[field.id] = z.boolean({ message: 'Você precisa confirmar esta opção.' }).refine(val => val === true, 'Você precisa confirmar esta opção.');
        }
      } else {
        if (field.type === 'boolean') {
          schemaShape[field.id] = z.boolean().optional();
        } else {
          schemaShape[field.id] = z.string().optional();
        }
      }
    });

    return z.object(schemaShape);
  };

  const schema = buildDynamicSchema(fields);

  type FormValues = z.infer<typeof schema>;

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })

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

  const renderField = (
    field: Field, 
    value: string | boolean | undefined, 
    onChange: (val: string | boolean) => void
  ) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder="Digite sua resposta..."
             value={(value as string) || ''} 
            onChangeText={onChange}
            style={styles.fieldInput}
          />
        );
      case 'number':
        return (
          <Input
            placeholder="0"
            keyboardType="numeric"
            value={(value as string) || ''} 
            onChangeText={onChange}
            style={styles.fieldInput}
          />
        );
      case 'boolean':
        return (
          <Checkbox
            label={value ? 'Confirmado' : 'Marcar para confirmar'}
            checked={!!value}
             onPress={() => onChange(!(value as boolean))} 
          />
        );
      case 'date':
         const currentDate = value ? new Date(value as string) : new Date();
        
        return (
          <View>
            <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(field.id)}>
              <FontAwesome name="calendar-alt" size={16} color="#4B5563" />
              <Text style={styles.datePickerText}>
                {value ? currentDate.toLocaleDateString('pt-BR') : 'Selecionar uma data...'}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker === field.id && (
              <DateTimePicker
                value={currentDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(null);
                  if (event.type === 'set' && selectedDate) {
                    onChange(selectedDate.toISOString());
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

  const onValidSubmit = (data: Record<string, any>) => {

    onSubmit(data, globalAttachments);
  };

  return (
    <View style={styles.screenContainer}>

      {fields.map((field) => (
        <View key={field.id} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {field.label} {field.required && <Text style={styles.required}>*</Text>}
          </Text>

          <Controller
            control={control}
            name={field.id} // O ID único da pergunta é o nome do campo pro RHF
            render={({ field: { onChange, value } }) => (
              <View>
                {renderField(field, value as string | boolean | undefined, onChange)}
                {errors[field.id] && (
                  <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, fontWeight: '500' }}>
                    {String(errors[field.id]?.message)}
                  </Text>
                )}
              </View>
            )}
          />
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
          onPress={handleSubmit(onValidSubmit)}
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