import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type CheckoutStackParamList = {
  Address: undefined;
  Delivery: undefined;
  Payment: undefined;
  Review: undefined;
};

export type CheckoutNavigationProp = NativeStackNavigationProp<
  CheckoutStackParamList,
  'Address'
>; 