import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeviceStore, Device } from '../../store/deviceStore';
import { useFonts } from '../../hooks/useFonts';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

export const DevicesScreen = () => {
  const navigation = useNavigation();
  const { devices, removeDevice } = useDeviceStore();
  const fontsLoaded = useFonts();
  
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const navigateToAddDevice = () => {
    navigation.navigate('AddDevice');
  };

  const handleLongPress = (device: Device) => {
    setSelectedDevice(device);
    setShowDeleteModal(true);
    
    // Animacja "wstrząsu" kafelka
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDelete = () => {
    if (selectedDevice) {
      removeDevice(selectedDevice.id);
      setShowDeleteModal(false);
      setSelectedDevice(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedDevice(null);
  };

  const renderDeviceItem = ({ item }: { item: Device }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onLongPress={() => handleLongPress(item)}
      delayLongPress={500} // 500ms długie przytrzymanie
    >
      <Animated.View 
        style={[
          styles.deviceCard, 
          { 
            backgroundColor: item.color,
            transform: [{ scale: selectedDevice?.id === item.id ? scaleAnim : 1 }]
          }
        ]}
      >
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.devicePlace}>{item.place}</Text>
        
        {/* Wskaźnik możliwości usunięcia */}
        <View style={styles.deleteHint}>
          <Ionicons name="trash-outline" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.deleteHintText}>Hold to delete</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  const renderAddButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={navigateToAddDevice}
      activeOpacity={0.7}
    >
      <Ionicons name="add" size={40} color="#007AFF" />
      <Text style={styles.addButtonText}>Add device</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }: { item: Device | null; index: number }) => {
    if (item) {
      return renderDeviceItem({ item });
    }
    
    if (index === devices.length) {
      return renderAddButton();
    }
    
    return null;
  };

  const data = [...devices, null];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>DEVICES</Text>
        {devices.length > 0 && (
          <Text style={styles.deviceCount}>{devices.length} device{devices.length !== 1 ? 's' : ''}</Text>
        )}
      </View>

      {/* Devices Grid */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id || `add-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <TouchableOpacity 
              style={styles.emptyAddButton} 
              onPress={navigateToAddDevice}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={50} color="#007AFF" />
              <Text style={styles.emptyText}>Add your first device</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal potwierdzenia usunięcia */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <TouchableWithoutFeedback onPress={handleCancelDelete}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Ionicons name="trash-outline" size={30} color="#FF3B30" />
                  <Text style={styles.modalTitle}>Delete Device</Text>
                </View>
                
                <Text style={styles.modalMessage}>
                  Are you sure you want to delete "{selectedDevice?.name}"?
                </Text>
                
                <Text style={styles.modalWarning}>
                  This action cannot be undone.
                </Text>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelModalButton]}
                    onPress={handleCancelDelete}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelModalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteModalButton]}
                    onPress={handleDelete}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash" size={18} color="#FFF" />
                    <Text style={styles.deleteModalButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    height: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingHorizontal: 16,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Roboto-Medium',
  },
  deviceCount: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    fontFamily: 'Roboto-Regular',
  },
  gridContainer: {
    padding: 16,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  deviceCard: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  devicePlace: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    fontFamily: 'Roboto-Regular',
  },
  deleteHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteHintText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
    fontFamily: 'Roboto-Regular',
  },
  addButton: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: '#007AFF',
    fontFamily: 'Roboto-Medium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyAddButton: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Roboto-Regular',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
    fontFamily: 'Roboto-Bold',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Roboto-Regular',
  },
  modalWarning: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Roboto-Medium',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelModalButton: {
    backgroundColor: '#F2F2F7',
  },
  deleteModalButton: {
    backgroundColor: '#FF3B30',
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'Roboto-Medium',
  },
  deleteModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Roboto-Medium',
  },
});