import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  SharedValue,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

type AccordionProps = PropsWithChildren<{
  isExpanded: SharedValue<boolean>;
  duration?: number;
  className?: string;
}>;

const Accordion = ({
  isExpanded,
  children,
  duration = 300,
  className = '',
}: AccordionProps) => {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );

  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      style={[bodyStyle]}
      className={`w-full overflow-hidden ${className}`}>
      <View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}
        className="w-full absolute">
        {children}
      </View>
    </Animated.View>
  );
};

export default Accordion;
