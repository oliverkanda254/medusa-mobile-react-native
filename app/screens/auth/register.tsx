import React, {useState} from 'react';
import {View, TouchableOpacity, ScrollView, Keyboard} from 'react-native';
import Text from '@components/common/text';
import Input from '@components/common/input';
import Button from '@components/common/button';
import {useCustomer} from '@data/customer-context';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Navbar from '@components/common/navbar';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterSchema = z.infer<typeof registerSchema>;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const {register: registerCustomer} = useCustomer();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setError: setFormError,
    formState: {errors},
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      await registerCustomer(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
      );
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              state: {
                routes: [{name: 'Profile'}],
              },
            },
          ],
        }),
      );
    } catch (err) {
      setFormError('root', {
        type: 'manual',
        message:
          err instanceof Error
            ? err.message
            : 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Navbar title="Register" />

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="p-4 gap-4">
          {errors.root && (
            <Text className="text-red-500 text-center">
              {errors.root.message}
            </Text>
          )}

          <Controller
            control={control}
            name="firstName"
            render={({field: {onChange, value}}) => (
              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={value}
                onChangeText={onChange}
                error={errors.firstName?.message}
                containerClassName="mb-0"
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({field: {onChange, value}}) => (
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={value}
                onChangeText={onChange}
                error={errors.lastName?.message}
                containerClassName="mb-0"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({field: {onChange, value}}) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email?.message}
                containerClassName="mb-0"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({field: {onChange, value}}) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
                containerClassName="mb-0"
              />
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            title={loading ? 'Creating account...' : 'Create Account'}
          />

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text className="text-center text-primary">
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
