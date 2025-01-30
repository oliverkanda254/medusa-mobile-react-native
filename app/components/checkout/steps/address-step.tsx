import React from 'react';
import {View, Switch} from 'react-native';
import Text from '@components/common/text';
import Input from '@components/common/input';
import {Controller, UseFormReturn} from 'react-hook-form';
import {CheckoutFormData} from '../../../types/checkout';
import AddressForm from '../address-form';

type AddressStepProps = {
  form: UseFormReturn<CheckoutFormData>;
  isLoading: boolean;
  countries: {label: string; value: string}[];
};

const AddressStep = ({form, isLoading, countries}: AddressStepProps) => {
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

export default AddressStep;
