import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

export default function UfPicker({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  const select = (uf) => {
    onChange(uf);
    setVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.selector, value ? styles.selectorFilled : null]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <View>
          <Text style={styles.label}>UF</Text>
          <Text style={[styles.value, value ? styles.valueFilled : null]}>{value || '—'}</Text>
        </View>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Selecione o estado</Text>
            <FlatList
              data={UF_LIST}
              keyExtractor={(item) => item}
              numColumns={3}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, item === value && styles.itemActive]}
                  onPress={() => select(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.itemText, item === value && styles.itemTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  selector: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorFilled: {
    backgroundColor: '#EFF6FF',
    borderLeftColor: '#2563EB',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  valueFilled: {
    color: '#1E293B',
  },
  arrow: {
    fontSize: 16,
    color: '#94A3B8',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '80%',
    maxHeight: '60%',
    paddingTop: 20,
    paddingBottom: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 12,
  },
  item: {
    flex: 1,
    margin: 4,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
  },
  itemActive: {
    backgroundColor: '#2563EB',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemTextActive: {
    color: '#FFFFFF',
  },
});
