import React from 'react';
import {View, ScrollView, Image} from 'react-native';
import Text from '@components/common/text';
import Navbar from '@components/common/navbar';
import {useQuery} from '@tanstack/react-query';
import apiClient from '@api/client';
import {formatImageUrl} from '@utils/image-url';
import {convertToLocale} from '@utils/product-price';
import dayjs from 'dayjs';
import Loader from '@components/common/loader';
import ErrorUI from '@components/common/error-ui';
import {getFulfillmentStatus, type FulfillmentStatus} from '@utils/order';

type OrderDetailProps = {
  route: {
    params: {
      orderId: string;
    };
  };
};

const OrderDetail = ({route}: OrderDetailProps) => {
  const {orderId} = route.params;

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const {order: orderData} = await apiClient.store.order.retrieve(orderId);
      return orderData;
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <Navbar title="Order Details" />
        <Loader />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background">
        <Navbar title="Order Details" />
        <ErrorUI />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 bg-background">
        <Navbar title="Order Details" />
        <Text className="text-center text-gray-500 mt-6">Order not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Navbar title="Order Details" />
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Order Header */}
          <View className="mb-6">
            <Text className="text-xl font-bold mb-1">
              Order #{order.display_id}
            </Text>
            <Text className="text-gray-500">
              Placed {dayjs(order.created_at).format('MMMM D, YYYY h:mm A')}
            </Text>
          </View>

          {/* Order Status */}
          <View className="mb-6">
            <Text className="font-semibold mb-2">Status</Text>
            <Text className="text-gray-700">
              {getFulfillmentStatus(
                order.fulfillment_status as FulfillmentStatus,
              )}
            </Text>
          </View>

          {/* Order Items */}
          <View className="mb-6">
            <Text className="font-semibold">Order Items</Text>
            {order.items?.map(item => (
              <View
                key={item.id}
                className="flex-row items-start py-4 border-b border-primary">
                <Image
                  source={{
                    uri: item.thumbnail
                      ? formatImageUrl(item.thumbnail)
                      : 'https://placeholder.com/48',
                  }}
                  className="w-12 h-12 rounded"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-medium">{item.title}</Text>
                      {item.variant?.title && (
                        <Text className="text-sm text-gray-500">
                          Variant: {item.variant.title}
                        </Text>
                      )}
                    </View>
                    <View className="items-end">
                      <Text className="text-sm">
                        {item.quantity}x{' '}
                        {convertToLocale({
                          amount: item.unit_price,
                          currency_code: order.currency_code,
                        })}
                      </Text>
                      <Text className="text-sm font-medium">
                        {convertToLocale({
                          amount: item.unit_price * item.quantity,
                          currency_code: order.currency_code,
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Shipping Address */}
          {order.shipping_address && (
            <View className="flex-row justify-between mb-6">
              <View className="gap-1">
                <Text className="text-gray-500 mb-1">Shipping Address</Text>
                <Text>
                  {order.shipping_address.first_name}{' '}
                  {order.shipping_address.last_name}
                </Text>
                <Text>{order.shipping_address.address_1}</Text>
                {order.shipping_address.address_2 && (
                  <Text>{order.shipping_address.address_2}</Text>
                )}
                <Text>
                  {order.shipping_address.city},{' '}
                  {order.shipping_address.province}{' '}
                  {order.shipping_address.postal_code}
                </Text>
                <Text>
                  {order.shipping_address.country_code?.toUpperCase()}
                </Text>
              </View>
              <View className="gap-1">
                <Text className="text-gray-500 mb-1">Contact</Text>
                <Text>{order.email}</Text>
                {order.shipping_address?.phone && (
                  <Text>{order.shipping_address.phone}</Text>
                )}
              </View>
            </View>
          )}

          <View className="mb-6">
            <View>
              <Text className="text-gray-500 mb-1">Method</Text>
              <Text>
                Standard Shipping (
                {convertToLocale({
                  amount: order.shipping_total,
                  currency_code: order.currency_code,
                })}
                )
              </Text>
            </View>
          </View>

          {/* Order Summary */}
          <View className="mb-6">
            <Text className="text-lg mb-2">Order Summary</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Subtotal</Text>
              <Text>
                {convertToLocale({
                  amount: order.subtotal,
                  currency_code: order.currency_code,
                })}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Shipping</Text>
              <Text>
                {convertToLocale({
                  amount: order.shipping_total,
                  currency_code: order.currency_code,
                })}
              </Text>
            </View>
            {order.discount_total > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Discount</Text>
                <Text className="text-green-600">
                  -
                  {convertToLocale({
                    amount: order.discount_total,
                    currency_code: order.currency_code,
                  })}
                </Text>
              </View>
            )}
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Taxes</Text>
              <Text>
                {order.tax_total
                  ? convertToLocale({
                      amount: order.tax_total,
                      currency_code: order.currency_code,
                    })
                  : '-'}
              </Text>
            </View>
            <View className="flex-row justify-between mt-2 pt-2 border-t border-primary">
              <Text className="font-content-bold text-lg">Total</Text>
              <Text className="font-content-bold text-lg">
                {convertToLocale({
                  amount: order.total,
                  currency_code: order.currency_code,
                })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetail;
