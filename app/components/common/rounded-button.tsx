import React, {PropsWithChildren} from 'react';
import {TouchableOpacity} from 'react-native';

type RoundedButtonProps = {
  onPress?: () => void;
};

const RoundedButton = ({
  children,
  onPress,
}: PropsWithChildren<RoundedButtonProps>) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-content-secondary h-12 w-12 rounded-full items-center justify-center elevation-sm">
      {children}
    </TouchableOpacity>
  );
};

export default RoundedButton;
