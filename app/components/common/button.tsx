import React from 'react';
import {TouchableOpacity} from 'react-native';
import Text from './text';

type BaseProps = {
  onClick?: () => void;
};

type WithTitle = BaseProps & {
  title: string;
  children?: never;
};

type WithChildren = BaseProps & {
  title?: never;
  children: React.ReactNode;
};

type Props = WithTitle | WithChildren;

const CommonButton = ({title, onClick, children}: Props) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      className="bg-primary justify-center items-center rounded-xl h-14">
      {children ? (
        children
      ) : (
        <Text
          className="font-content-bold text-content-inverse block mx-4"
          numberOfLines={1}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CommonButton;
