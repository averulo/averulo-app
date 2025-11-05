<TouchableOpacity 
  onPress={() => navigation.navigate('PaymentHistory')}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="card-outline" size={24} color="#667EEA" />
    <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
      Payment History
    </Text>
  </View>
  <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
</TouchableOpacity>