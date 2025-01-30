import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Text from '@components/common/text';
import Input from '@components/common/input';
import {useCart, AddressFields} from '@data/cart-context';
import {useNavigation} from '@react-navigation/native';
import Button from '@components/common/button';
import {useColors} from '@styles/hooks';
import AntDesign from '@react-native-vector-icons/ant-design';
import {useRegion} from '@data/region-context';
import {
  useForm,
  Controller,
  UseFormReturn,
  FieldError,
  Path,
} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import Navbar from '@components/common/navbar';
import {Picker} from '@react-native-picker/picker';
import {convertToLocale} from '@utils/product-price';
import apiClient from '@api/client';
import {HttpTypes} from '@medusajs/types';
import {useQuery} from '@tanstack/react-query';
import CartContent from '@components/cart/cart-content';

type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review';

const CHECKOUT_STEPS: {
  id: CheckoutStep;
  title: string;
  icon: 'environment' | 'inbox' | 'wallet' | 'profile';
}[] = [
  {id: 'address', title: 'Address', icon: 'environment'},
  {id: 'delivery', title: 'Delivery', icon: 'inbox'},
  {id: 'payment', title: 'Payment', icon: 'wallet'},
  {id: 'review', title: 'Review', icon: 'profile'},
];

const CheckoutSteps = ({
  currentStep,
  onStepPress,
}: {
  currentStep: CheckoutStep;
  onStepPress: (step: CheckoutStep) => void;
}) => {
  const colors = useColors();

  return (
    <View className="flex-row justify-between items-center mb-6 px-4">
      {CHECKOUT_STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isPast =
          CHECKOUT_STEPS.findIndex(s => s.id === currentStep) > index;

        return (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <View
                className={`h-[1px] flex-1 mx-2 ${
                  isPast ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            )}
            <TouchableOpacity
              onPress={() => isPast && onStepPress(step.id)}
              disabled={!isPast}
              className="items-center">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isActive
                    ? 'bg-primary'
                    : isPast
                    ? 'bg-primary opacity-80'
                    : 'bg-gray-300'
                }`}>
                <AntDesign
                  name={step.icon}
                  size={16}
                  color={
                    isActive || isPast ? colors.contentInverse : colors.content
                  }
                />
              </View>
              <Text
                className={`text-xs mt-1 ${
                  isActive ? 'text-primary font-content-bold' : 'text-gray-500'
                }`}>
                {step.title}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const addressSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address_1: z.string().min(1, 'Address is required'),
  company: z.string().optional().or(z.literal('')),
  postal_code: z.string().min(1, 'Postal code is required'),
  city: z.string().min(1, 'City is required'),
  country_code: z.string().min(1, 'Country is required'),
  province: z.string().optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone is required'),
}) satisfies z.ZodType<AddressFields>;

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  shipping_address: addressSchema,
  billing_address: addressSchema,
  use_same_billing: z.boolean(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const AddressForm = ({
  title,
  form,
  type,
  isLoading,
  countries,
}: {
  title: string;
  form: UseFormReturn<CheckoutFormData>;
  type: 'shipping' | 'billing';
  isLoading?: boolean;
  countries: {label: string; value: string}[];
}) => {
  const {
    control,
    formState: {errors},
    clearErrors,
  } = form;

  const addressErrors = errors[`${type}_address`] as
    | {[K in keyof AddressFields]?: FieldError}
    | undefined;

  const getFieldName = (field: keyof AddressFields): Path<CheckoutFormData> =>
    `${type}_address.${field}` as Path<CheckoutFormData>;

  const handleFieldChange =
    (field: keyof AddressFields, onChange: (value: string) => void) =>
    (value: string) => {
      clearErrors(`${type}_address.${field}`);
      onChange(value);
    };

  return (
    <View className="space-y-4">
      <Text className="text-2xl mb-4">{title}</Text>
      <Controller
        control={control}
        name={getFieldName('first_name')}
        render={({field: {onChange, value}}) => (
          <Input
            label="First Name"
            value={value as string}
            onChangeText={handleFieldChange('first_name', onChange)}
            error={addressErrors?.first_name?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('last_name')}
        render={({field: {onChange, value}}) => (
          <Input
            label="Last Name"
            value={value as string}
            onChangeText={handleFieldChange('last_name', onChange)}
            error={addressErrors?.last_name?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('address_1')}
        render={({field: {onChange, value}}) => (
          <Input
            label="Address"
            value={value as string}
            onChangeText={handleFieldChange('address_1', onChange)}
            error={addressErrors?.address_1?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('company')}
        render={({field: {onChange, value}}) => (
          <Input
            label="Company (Optional)"
            value={value as string}
            onChangeText={handleFieldChange('company', onChange)}
            error={addressErrors?.company?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('postal_code')}
        render={({field: {onChange, value}}) => (
          <Input
            label="Postal Code"
            value={value as string}
            onChangeText={handleFieldChange('postal_code', onChange)}
            error={addressErrors?.postal_code?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('city')}
        render={({field: {onChange, value}}) => (
          <Input
            label="City"
            value={value as string}
            onChangeText={handleFieldChange('city', onChange)}
            error={addressErrors?.city?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('province')}
        render={({field: {onChange, value}}) => (
          <Input
            label="Province/State (Optional)"
            value={value as string}
            onChangeText={handleFieldChange('province', onChange)}
            error={addressErrors?.province?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('country_code')}
        render={({field: {onChange, value}}) => (
          <View className="mb-4">
            <Text className="text-sm font-content mb-2">Country</Text>
            <View
              className={`border rounded-md ${
                addressErrors?.country_code
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}>
              <Picker
                selectedValue={value}
                onValueChange={val => {
                  clearErrors(`${type}_address.country_code`);
                  onChange(val);
                }}
                enabled={!isLoading}>
                <Picker.Item label="Select a country" value="" />
                {countries.map(country => (
                  <Picker.Item
                    key={country.value}
                    label={country.label}
                    value={country.value}
                  />
                ))}
              </Picker>
            </View>
            {addressErrors?.country_code?.message && (
              <Text className="text-red-500 text-xs mt-1">
                {addressErrors.country_code.message}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name={getFieldName('phone')}
        render={({field: {onChange, value}}) => (
          <Input
            label="Phone"
            value={value as string}
            onChangeText={handleFieldChange('phone', onChange)}
            error={addressErrors?.phone?.message}
            editable={!isLoading}
          />
        )}
      />
    </View>
  );
};

const AddressStep = ({
  form,
  isLoading,
  countries,
}: {
  form: UseFormReturn<CheckoutFormData>;
  isLoading: boolean;
  countries: {label: string; value: string}[];
}) => {
  const {watch, clearErrors} = form;
  const useSameBilling = watch('use_same_billing');

  return (
    <View className="space-y-6">
      <Controller
        control={form.control}
        name="email"
        render={({field: {onChange, value}}) => (
          <Input
            label="Email"
            value={value}
            onChangeText={val => {
              clearErrors('email');
              onChange(val);
            }}
            error={form.formState.errors.email?.message}
            editable={!isLoading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />

      <AddressForm
        title="Shipping Address"
        form={form}
        type="shipping"
        isLoading={isLoading}
        countries={countries}
      />

      <View className="flex-row items-center space-x-2">
        <Controller
          control={form.control}
          name="use_same_billing"
          render={({field: {onChange, value}}) => (
            <Switch
              value={value}
              onValueChange={onChange}
              disabled={isLoading}
            />
          )}
        />
        <Text>Use same address for billing</Text>
      </View>

      {!useSameBilling && (
        <AddressForm
          title="Billing Address"
          form={form}
          type="billing"
          isLoading={isLoading}
          countries={countries}
        />
      )}
    </View>
  );
};

const ShippingStep = ({cart}: {cart: HttpTypes.StoreCart}) => {
  const colors = useColors();
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({});
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(
    cart?.shipping_methods?.[0]?.shipping_option_id || null,
  );
  const [updatingOptionId, setUpdatingOptionId] = useState<string | null>(null);
  const [isCalculatingPrices, setIsCalculatingPrices] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {data: shippingOptions, isLoading: isLoadingShippingOptions} = useQuery(
    {
      queryKey: ['shipping-options', cart?.id],
      queryFn: async () => {
        if (!cart?.id) {
          throw new Error('No cart ID');
        }
        const {shipping_options} =
          await apiClient.store.fulfillment.listCartOptions({
            cart_id: cart.id,
          });
        return shipping_options;
      },
      enabled: !!cart?.id,
    },
  );

  // Calculate prices for shipping options
  useEffect(() => {
    if (!cart?.id || !shippingOptions?.length) {
      return;
    }

    setIsCalculatingPrices(true);
    const calculatedOptions = shippingOptions.filter(
      sm => sm.price_type === 'calculated',
    );

    if (calculatedOptions.length) {
      Promise.all(
        calculatedOptions.map(option =>
          apiClient.store.fulfillment
            .calculate(option.id, {
              cart_id: cart.id,
            })
            .then(({shipping_option}) => ({
              id: shipping_option.id,
              amount: shipping_option.amount,
            })),
        ),
      )
        .then(results => {
          const pricesMap: Record<string, number> = {};
          results.forEach(result => {
            if (result.id && result.amount) {
              pricesMap[result.id] = result.amount;
            }
          });
          setCalculatedPricesMap(pricesMap);
        })
        .catch((err: Error) => {
          console.error('Failed to calculate shipping prices:', err);
        })
        .finally(() => {
          setIsCalculatingPrices(false);
        });
    } else {
      setIsCalculatingPrices(false);
    }
  }, [cart?.id, shippingOptions]);

  const handleShippingMethodSelect = async (id: string) => {
    if (!cart?.id) {
      return;
    }

    // Skip if this option is already selected
    if (selectedMethodId === id) {
      return;
    }

    setError(null);
    setUpdatingOptionId(id);

    try {
      await apiClient.store.cart.addShippingMethod(cart.id, {
        option_id: id,
      });
      setSelectedMethodId(id);
    } catch (err) {
      setError('Failed to update shipping method');
      console.error(err);
    } finally {
      setUpdatingOptionId(null);
    }
  };

  if (isLoadingShippingOptions || !shippingOptions?.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading shipping options...</Text>
      </View>
    );
  }

  return (
    <View className="space-y-6">
      <Text className="text-2xl mb-4">Select Shipping Method</Text>
      {error && (
        <Text className="text-red-500 mb-4" testID="shipping-error">
          {error}
        </Text>
      )}
      <View className="gap-4">
        {shippingOptions.map(option => {
          const isCalculated = option.price_type === 'calculated';
          const amount = isCalculated
            ? calculatedPricesMap[option.id]
            : option.amount;
          const isUpdating = updatingOptionId === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleShippingMethodSelect(option.id)}
              disabled={isUpdating || (isCalculated && isCalculatingPrices)}
              className={`p-4 border rounded-lg flex-row justify-between items-center ${
                selectedMethodId === option.id
                  ? 'border-primary'
                  : 'border-gray-200'
              }`}>
              <View className="flex-row items-center flex-1">
                <View
                  className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
                    selectedMethodId === option.id
                      ? 'border-primary'
                      : 'border-gray-300'
                  }`}>
                  {selectedMethodId === option.id ? (
                    <View className="h-3 w-3 rounded-full bg-primary" />
                  ) : null}
                </View>
                <Text className="ml-2 flex-1">{option.name}</Text>
              </View>
              {isUpdating ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text>
                  {isCalculated && isCalculatingPrices
                    ? 'Calculating...'
                    : amount !== undefined
                    ? convertToLocale({
                        amount,
                        currency_code: cart.currency_code,
                      })
                    : '-'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

type PaymentProvider = {
  id: string;
  name: string;
  description?: string;
  is_installed: boolean;
};

const PAYMENT_PROVIDER_DETAILS_MAP: Record<
  string,
  {name: string; hasExternalStep: boolean}
> = {
  pp_system_default: {name: 'Manual', hasExternalStep: false},
  pp_stripe_stripe: {name: 'Stripe', hasExternalStep: true},
};

const PaymentStep = ({
  cart,
  selectedProviderId,
  onSelectProvider,
}: {
  cart: HttpTypes.StoreCart;
  selectedProviderId: string | null;
  onSelectProvider: (providerId: string) => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  // Fetch available payment providers
  const {data: paymentProviders, isLoading: isLoadingProviders} = useQuery({
    queryKey: ['payment-providers', cart?.region_id],
    queryFn: async () => {
      if (!cart?.region_id) {
        throw new Error('No region ID');
      }
      const {payment_providers} =
        await apiClient.store.payment.listPaymentProviders({
          region_id: cart.region_id,
        });
      return payment_providers as PaymentProvider[];
    },
    enabled: !!cart?.region_id,
  });

  const handleProviderSelect = (provider: PaymentProvider) => {
    // Skip if this provider is already selected
    if (selectedProviderId === provider.id) {
      return;
    }

    setError(null);
    onSelectProvider(provider.id);
  };

  const getPaymentUI = () => {
    if (!selectedProviderId) {
      return null;
    }

    switch (selectedProviderId) {
      case 'pp_stripe_stripe':
        return <Text>Stripe payment UI coming soon!</Text>;
      case 'pp_system_default':
        return <Text>No additional actions required for manual payment.</Text>;
      default:
        return (
          <Text>
            Payment provider{' '}
            {PAYMENT_PROVIDER_DETAILS_MAP[selectedProviderId]?.name ||
              selectedProviderId}{' '}
            is in development.
          </Text>
        );
    }
  };

  if (isLoadingProviders || !paymentProviders?.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading payment options...</Text>
      </View>
    );
  }

  return (
    <View className="space-y-6">
      <Text className="text-2xl mb-4">Select Payment Method</Text>
      {error && (
        <Text className="text-red-500 mb-4" testID="payment-error">
          {error}
        </Text>
      )}
      <View className="gap-4">
        {paymentProviders.map(provider => {
          const isSelected = selectedProviderId === provider.id;
          const displayName =
            PAYMENT_PROVIDER_DETAILS_MAP[provider.id]?.name || provider.id;

          return (
            <TouchableOpacity
              key={provider.id}
              onPress={() => handleProviderSelect(provider)}
              className={`p-4 border rounded-lg flex-row justify-between items-center ${
                isSelected ? 'border-primary' : 'border-gray-200'
              }`}>
              <View className="flex-row items-center flex-1">
                <View
                  className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
                    isSelected ? 'border-primary' : 'border-gray-300'
                  }`}>
                  {isSelected ? (
                    <View className="h-3 w-3 rounded-full bg-primary" />
                  ) : null}
                </View>
                <Text className="ml-2 flex-1">{displayName}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedProviderId && (
        <View className="mt-6 p-4 bg-gray-50 rounded-lg">{getPaymentUI()}</View>
      )}
    </View>
  );
};

const Checkout = () => {
  const {cart, updateCart, resetCart} = useCart();
  const {region} = useRegion();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  // Get initial selected provider from cart's payment session
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === 'pending',
  );
  const [selectedPaymentProviderId, setSelectedPaymentProviderId] = useState<
    string | null
  >(activeSession?.provider_id || null);

  const getCurrentStep = (): CheckoutStep => {
    if (!cart?.shipping_address?.address_1 || !cart?.email) {
      return 'address';
    }

    if (!cart?.shipping_methods?.[0]?.shipping_option_id) {
      return 'delivery';
    }

    if (cart?.total === 0) {
      return 'payment';
    }

    return 'review';
  };

  const [activeStep, setActiveStep] = useState<CheckoutStep>(getCurrentStep());

  const defaultAddress: AddressFields = {
    first_name: '',
    last_name: '',
    address_1: '',
    company: '',
    postal_code: '',
    city: '',
    country_code: '',
    province: '',
    phone: '',
  };

  const getAddressFromCart = (
    cartAddress: NonNullable<typeof cart>['shipping_address'] | null,
  ): AddressFields => {
    if (!cartAddress) {
      return defaultAddress;
    }

    return {
      first_name: cartAddress.first_name || '',
      last_name: cartAddress.last_name || '',
      address_1: cartAddress.address_1 || '',
      company: cartAddress.company || '',
      postal_code: cartAddress.postal_code || '',
      city: cartAddress.city || '',
      country_code: cartAddress.country_code || '',
      province: cartAddress.province || '',
      phone: cartAddress.phone || '',
    };
  };

  const defaultValues: CheckoutFormData = {
    email: cart?.email || '',
    shipping_address: getAddressFromCart(cart?.shipping_address),
    billing_address: getAddressFromCart(cart?.billing_address),
    use_same_billing:
      cart?.billing_address && cart?.shipping_address
        ? JSON.stringify(cart.billing_address) ===
          JSON.stringify(cart.shipping_address)
        : true,
  };

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
  });

  // Check if cart is empty
  const isEmptyCart = !cart?.items || cart.items.length === 0;

  if (isEmptyCart) {
    return null;
  }

  const countries =
    region?.countries
      ?.map(country => ({
        label: country.display_name || country.iso_2,
        value: country.iso_2,
      }))
      .filter((country): country is {label: string; value: string} =>
        Boolean(country.label && country.value),
      ) || [];

  const renderStep = () => {
    switch (activeStep) {
      case 'address':
        return (
          <AddressStep
            form={form}
            isLoading={isLoading}
            countries={countries}
          />
        );
      case 'delivery':
        return <ShippingStep cart={cart} />;
      case 'payment':
        return (
          <PaymentStep
            cart={cart}
            selectedProviderId={selectedPaymentProviderId}
            onSelectProvider={setSelectedPaymentProviderId}
          />
        );
      case 'review':
        // Find the selected shipping option
        const selectedShippingMethod = cart.shipping_methods?.at(-1);

        const selectedPaymentMethodId =
          cart.payment_collection?.payment_sessions?.find(
            (paymentSession: any) => paymentSession.status === 'pending',
          )?.provider_id || '';

        return (
          <View>
            <CartContent cart={cart} mode="checkout" />
            <View className="mt-6 space-y-4">
              {/* Selected Shipping Method */}
              <View className="p-4 bg-gray-50 rounded-lg">
                <Text className="font-content-bold mb-2">Shipping Method</Text>
                <Text className="text-gray-700">
                  {selectedShippingMethod?.name ||
                    selectedShippingMethod?.id ||
                    'No shipping method selected'}
                </Text>
              </View>

              {/* Selected Payment Method */}
              <View className="p-4 bg-gray-50 rounded-lg">
                <Text className="font-content-bold mb-2">Payment Method</Text>
                <Text className="text-gray-700">
                  {selectedPaymentMethodId
                    ? PAYMENT_PROVIDER_DETAILS_MAP[selectedPaymentMethodId]
                        ?.name || selectedPaymentMethodId
                    : 'No payment method selected'}
                </Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const handleStepPress = (step: CheckoutStep) => {
    const currentStep = getCurrentStep();
    const currentStepIndex = CHECKOUT_STEPS.findIndex(
      s => s.id === currentStep,
    );
    const targetStepIndex = CHECKOUT_STEPS.findIndex(s => s.id === step);

    // Only allow navigation to steps that are before the current required step
    if (targetStepIndex < currentStepIndex) {
      setActiveStep(step);
      form.reset(form.getValues()); // Preserve form values when navigating
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      switch (activeStep) {
        case 'address':
          const formData = form.getValues();
          const {email, shipping_address, billing_address, use_same_billing} =
            formData;

          await updateCart({
            email,
            shipping_address,
            billing_address: use_same_billing
              ? shipping_address
              : billing_address,
          });
          setActiveStep('delivery');
          break;
        case 'delivery':
          setActiveStep('payment');
          break;
        case 'payment':
          if (!selectedPaymentProviderId) {
            throw new Error('Please select a payment method');
          }

          // Initialize payment session before moving to review
          await apiClient.store.payment.initiatePaymentSession(cart, {
            provider_id: selectedPaymentProviderId,
          });
          setActiveStep('review');
          break;
        case 'review':
          if (!cart?.id) {
            throw new Error('No cart found');
          }

          const selectedProvider = selectedPaymentProviderId
            ? PAYMENT_PROVIDER_DETAILS_MAP[selectedPaymentProviderId]
            : null;

          if (selectedProvider?.hasExternalStep) {
            // Handle external payment flow (e.g., Stripe)
            switch (selectedPaymentProviderId) {
              case 'pp_stripe_stripe':
                // TODO: Implement Stripe payment flow
                break;
              default:
                throw new Error('Payment provider not supported');
            }
          } else {
            // Complete cart directly
            const response = await apiClient.store.cart.complete(cart.id);

            if (response.type === 'cart') {
              // An error occurred during checkout
              throw new Error(
                response.error?.message || 'Failed to complete order',
              );
            } else {
              // Order placed successfully
              Alert.alert(
                'Success',
                'Your order has been placed successfully!',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      await resetCart();
                      navigation.navigate('Home');
                    },
                  },
                ],
              );
            }
          }
          break;
      }
    } catch (error) {
      console.error('Error:', error);
      // Show error to user
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    switch (activeStep) {
      case 'address':
        return 'Continue to delivery';
      case 'delivery':
        return 'Continue to payment';
      case 'payment':
        return 'Review order';
      case 'review':
        const selectedProvider = selectedPaymentProviderId
          ? PAYMENT_PROVIDER_DETAILS_MAP[selectedPaymentProviderId]
          : null;

        if (selectedProvider?.hasExternalStep) {
          return `Pay using ${selectedProvider.name}`;
        }
        return 'Place order';
      default:
        return 'Continue';
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">
        <View className="mb-4">
          <Navbar title="Checkout" />
        </View>
        <CheckoutSteps currentStep={activeStep} onStepPress={handleStepPress} />
        <ScrollView className="flex-1 px-4" contentContainerClassName="pb-4">
          {renderStep()}
        </ScrollView>
      </View>
      <View className="p-4 bg-background border-t border-gray-200">
        <Button
          variant="primary"
          title={getButtonText()}
          onPress={handleContinue}
          loading={isLoading}
        />
      </View>
    </View>
  );
};

export default Checkout;
