import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentHistoryScreen = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = async () => {
    try {
      setError(null);
      setLoading(true);

      // Replace with your actual API endpoint
      // const token = await AsyncStorage.getItem('token');
      // const response = await fetch('YOUR_API_URL/api/payments/history', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = [
        {
          id: '1',
          propertyTitle: 'Luxury Ocean View Suite - Ave Grand Hotel',
          amount: 45000,
          date: '2025-10-28T14:30:00Z',
          status: 'SUCCESS',
          paymentMethod: 'Credit Card',
          transactionId: 'TXN-2025-001234'
        },
        {
          id: '2',
          propertyTitle: 'Executive Business Room - Ave Downtown',
          amount: 28500,
          date: '2025-10-15T09:15:00Z',
          status: 'SUCCESS',
          paymentMethod: 'Debit Card',
          transactionId: 'TXN-2025-001189'
        },
        {
          id: '3',
          propertyTitle: 'Deluxe Garden Villa - Ave Resort & Spa',
          amount: 67800,
          date: '2025-09-22T16:45:00Z',
          status: 'FAILED',
          paymentMethod: 'Credit Card',
          transactionId: 'TXN-2025-000956',
          failureReason: 'Insufficient funds'
        },
        {
          id: '4',
          propertyTitle: 'Premium City View Room - Ave Central',
          amount: 32000,
          date: '2025-08-10T11:20:00Z',
          status: 'SUCCESS',
          paymentMethod: 'Bank Transfer',
          transactionId: 'TXN-2025-000678'
        },
        {
          id: '5',
          propertyTitle: 'Standard Double Room - Ave Express',
          amount: 15000,
          date: '2025-07-05T13:00:00Z',
          status: 'PENDING',
          paymentMethod: 'Credit Card',
          transactionId: 'TXN-2025-000445'
        },
      ];

      setPayments(mockData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load payment history. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return { bg: '#10B981', text: '#FFF' };
      case 'FAILED':
        return { bg: '#EF4444', text: '#FFF' };
      case 'PENDING':
        return { bg: '#F59E0B', text: '#FFF' };
      default:
        return { bg: '#6B7280', text: '#FFF' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'checkmark-circle';
      case 'FAILED':
        return 'close-circle';
      case 'PENDING':
        return 'time';
      default:
        return 'help-circle';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={styles.loadingText}>Loading payments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorTitle}>Unable to Load Payments</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPayments}>
          <Ionicons name="refresh" size={20} color="#FFF" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (payments.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="card-outline" size={64} color="#667EEA" />
        <Text style={styles.emptyTitle}>No Payment History</Text>
        <Text style={styles.emptyText}>
          Your payment history will appear here once you complete your first booking.
        </Text>
        <TouchableOpacity style={styles.browseButton}>
          <Text style={styles.browseButtonText}>Browse Hotels</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const successCount = payments.filter(p => p.status === 'SUCCESS').length;
  const totalSpent = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#667EEA" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Payments List */}
        {payments.map((payment) => {
          const { date, time } = formatDate(payment.date);
          const statusColor = getStatusColor(payment.status);
          const statusIcon = getStatusIcon(payment.status);

          return (
            <View key={payment.id} style={styles.paymentCard}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.propertyTitle} numberOfLines={2}>
                    {payment.propertyTitle}
                  </Text>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionId}>{payment.transactionId}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.paymentMethod}>{payment.paymentMethod}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                  <Ionicons name={statusIcon} size={16} color={statusColor.text} />
                  <Text style={[styles.statusText, { color: statusColor.text }]}>
                    {payment.status}
                  </Text>
                </View>
              </View>

              {/* Details */}
              <View style={styles.cardDetails}>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.dateText}>
                    {date} <Text style={styles.timeText}>{time}</Text>
                  </Text>
                </View>
                <Text style={styles.amountText}>{formatCurrency(payment.amount)}</Text>
              </View>

              {/* Failure Reason */}
              {payment.status === 'FAILED' && payment.failureReason && (
                <View style={styles.failureContainer}>
                  <Ionicons name="alert-circle" size={16} color="#DC2626" />
                  <View style={styles.failureTextContainer}>
                    <Text style={styles.failureTitle}>Payment Failed</Text>
                    <Text style={styles.failureReason}>{payment.failureReason}</Text>
                  </View>
                </View>
              )}

              {/* Pending Note */}
              {payment.status === 'PENDING' && (
                <View style={styles.pendingContainer}>
                  <Ionicons name="time" size={16} color="#D97706" />
                  <Text style={styles.pendingText}>
                    Payment is being processed. This may take a few minutes.
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Transactions</Text>
            <Text style={styles.summaryValue}>{payments.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Successful</Text>
            <Text style={styles.summaryValue}>{successCount}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValueAmount}>{formatCurrency(totalSpent)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#667EEA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  browseButton: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  browseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionId: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  dot: {
    color: '#D1D5DB',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  timeText: {
    color: '#9CA3AF',
  },
  amountText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#667EEA',
  },
  failureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  failureTextContainer: {
    flex: 1,
  },
  failureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 2,
  },
  failureReason: {
    fontSize: 13,
    color: '#B91C1C',
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pendingText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#667EEA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#E0E7FF',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  summaryValueAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default PaymentHistoryScreen;