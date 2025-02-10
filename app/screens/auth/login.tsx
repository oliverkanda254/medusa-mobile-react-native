import React, {useState} from 'react';
import {View, TouchableOpacity, Keyboard} from 'react-native';
import Text from '@components/common/text';
import Input from '@components/common/input';
import {useCustomer} from '@data/customer-context';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Navbar from '@components/common/navbar';
import Button from '@components/common/button';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const {login} = useCustomer();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setError: setFormError,
    formState: {errors},
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      await login(data.email, data.password);
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
            : 'Invalid credentials. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title="Sign In" />

      <View className="p-4 flex-1">
        <View className="gap-4">
          {errors.root && (
            <Text className="text-red-500 text-center">
              {errors.root.message}
            </Text>
          )}

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
            title={loading ? 'Signing in...' : 'Sign In'}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-base text-center text-primary">
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
