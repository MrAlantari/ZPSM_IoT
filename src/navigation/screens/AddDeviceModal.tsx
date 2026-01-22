import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ColorPicker from 'react-native-wheel-color-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDeviceStore } from '../../store/deviceStore';
import { useFonts } from '../../hooks/useFonts';

const { width } = Dimensions.get('window');

export const AddDeviceModal = () => {
  const navigation = useNavigation();
  const { addDevice } = useDeviceStore();
  const fontsLoaded = useFonts();
  
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [command, setCommand] = useState('');
  const [selectedColor, setSelectedColor] = useState('#007AFF'); // Domyślny kolor
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const colorPickerRef = useRef<any>(null);

  const handleSave = () => {
    if (!name.trim() || !place.trim() || !command.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    addDevice({
      name: name.trim(),
      place: place.trim(),
      command: command.trim(),
      color: selectedColor,
    });

    // Reset form i zamknij modal
    setName('');
    setPlace('');
    setCommand('');
    setSelectedColor('#007AFF');
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const onColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter device name"
              placeholderTextColor="#999999"
              autoCapitalize="words"
              maxLength={30}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Place</Text>
            <TextInput
              style={styles.input}
              value={place}
              onChangeText={setPlace}
              placeholder="Enter room name"
              placeholderTextColor="#999999"
              autoCapitalize="words"
              maxLength={30}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Command</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={command}
              onChangeText={setCommand}
              placeholder="Enter command"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={200}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Color</Text>
            
            {/* Podgląd wybranego koloru */}
            <View style={styles.colorPreviewContainer}>
              <View 
                style={[
                  styles.colorPreview, 
                  { backgroundColor: selectedColor }
                ]} 
              />
              <Text style={styles.colorHex}>{selectedColor.toUpperCase()}</Text>
              
              <TouchableOpacity 
                style={styles.colorPickerToggle}
                onPress={toggleColorPicker}
              >
                <Ionicons 
                  name={showColorPicker ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {/* Color Picker */}
            {showColorPicker && (
              <View style={styles.colorPickerContainer}>
                <ColorPicker
                  ref={colorPickerRef}
                  color={selectedColor}
                  swatchesOnly={false}
                  onColorChange={onColorChange}
                  onColorChangeComplete={onColorChange}
                  thumbSize={30}
                  sliderSize={30}
                  noSnap={true}
                  row={false}
                  swatches={true}
                  swatchesLast={true}
                />
                
                {/* Przyciski do szybkiego wyboru popularnych kolorów */}
                <View style={styles.quickColorsContainer}>
                  <Text style={styles.quickColorsLabel}>Quick colors:</Text>
                  <View style={styles.quickColorsGrid}>
                    {['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#7209B7', '#F3722C'].map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[styles.quickColor, { backgroundColor: color }]}
                        onPress={() => {
                          setSelectedColor(color);
                          if (colorPickerRef.current) {
                            colorPickerRef.current._onColorChange(color);
                          }
                        }}
                      >
                        {selectedColor === color && (
                          <Ionicons name="checkmark" size={16} color="#FFF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
    fontFamily: 'Roboto-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    fontFamily: 'Roboto-Regular',
  },
  textArea: {
    minHeight: 100,
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 12,
  },
  colorHex: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  colorPickerToggle: {
    padding: 8,
  },
  colorPickerContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  colorPicker: {
    width: width - 48,
    height: 300,
  },
  quickColorsContainer: {
    marginTop: 20,
    width: '100%',
  },
  quickColorsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'Roboto-Regular',
  },
  quickColorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickColor: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cancelButton: {
    backgroundColor: '#F2F2F2',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
  },
});