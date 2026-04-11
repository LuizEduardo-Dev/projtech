import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Field } from '../../store/useFormStore';

interface FormRendererProps {
    title: string;
    fields: Field[];

    onSubmit: (answers: Record<string, any>) => void;
}

export function FormRenderer({ title, fields, onSubmit }: FormRendererProps) {

    const [answers, setAnswers] = useState<Record<string, any>>({});


    const handleAnswerChange = (id: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [id]: value }));
    };


    const handleTakePic = async (fieldId: string) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Precisamos de permissão para acessar suas fotos!")
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
        })

        if (!result.canceled) {
            handleAnswerChange(fieldId, result.assets[0].uri)
        }
    }


    const renderField = (field: Field) => {
        switch (field.type) {
            case 'text':
                return (
                    <Input
                        placeholder="Digite sua resposta..."
                        value={answers[field.id] || ''}
                        onChangeText={(text) => handleAnswerChange(field.id, text)}
                    />
                );
            case 'number':
                return (
                    <Input
                        placeholder="0"
                        keyboardType="numeric"
                        value={answers[field.id] || ''}
                        onChangeText={(text) => handleAnswerChange(field.id, text)}
                    />
                );
            case 'boolean':
                return (
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>
                            {answers[field.id] ? 'Sim' : 'Não'}
                        </Text>
                        {/* O Switch nativo do React Native */}
                        <Switch
                            value={!!answers[field.id]}
                            onValueChange={(value) => handleAnswerChange(field.id, value)}
                            trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                            thumbColor={answers[field.id] ? '#10B981' : '#F3F4F6'}
                        />
                    </View>
                );
            case 'image':
                const imageUri = answers[field.id];
                return (
                    <View>
                        {imageUri ? (

                            <View style={styles.imagePreviewContainer}>
                                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                                <TouchableOpacity onPress={() => handleTakePic(field.id)}>
                                    <Text style={styles.changeImageText}>Trocar Foto</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (

                            <TouchableOpacity style={styles.imageButton} onPress={() => handleTakePic(field.id)}>
                                <Text style={styles.imageButtonText}>📸 Anexar Foto da Galeria</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            {/* Aqui nós iteramos o JSON e chamamos o Motor para cada campo */}
            {fields.map((field) => (
                <View key={field.id} style={styles.fieldContainer}>
                    <Text style={styles.label}>
                        {field.label} {field.required && <Text style={styles.required}>*</Text>}
                    </Text>

                    {/* Chama o switch para renderizar o input certo */}
                    {renderField(field)}
                </View>
            ))}

            <Button
                label="Enviar Auditoria"
                onPress={() => onSubmit(answers)}
                style={styles.submitBtn}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
        textAlign: 'center',
    },
    fieldContainer: {
        marginBottom: 16,
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
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DCDCDC',
    },
    switchLabel: {
        fontSize: 16,
        color: '#4B5563',
        fontWeight: '500',
    },
    imageButton: {
        backgroundColor: '#EEF2FF',
        borderWidth: 1,
        borderColor: '#818CF8',
        borderStyle: 'dashed',
        borderRadius: 5,
        padding: 16,
        alignItems: 'center',
    },
    imageButtonText: {
        color: '#4F46E5',
        fontWeight: 'bold',
    },
    submitBtn: {
        marginTop: 24,
        backgroundColor: '#2563EB',
    },
    imagePreviewContainer: {
        alignItems: 'center',
        gap: 8,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    changeImageText: {
        color: '#2563EB',
        fontWeight: '600',
        marginTop: 8,
    },
});