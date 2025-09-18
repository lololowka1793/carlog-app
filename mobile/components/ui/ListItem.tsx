// mobile/components/ui/ListItem.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { listStyles as s } from '../../styles/list';

type Props = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
  testID?: string;
};

export function ListItem({ title, subtitle, left, right, onPress, testID }: Props) {
  const Content = (
    <View style={s.item}>
      {left}
      <View style={s.itemTextWrap}>
        <Text style={s.itemTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        {!!subtitle && (
          <Text style={s.itemSubtitle} numberOfLines={1} ellipsizeMode="tail">{subtitle}</Text>
        )}
      </View>
      {right}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress} testID={testID}>{Content}</Pressable>;
  }
  return Content;
}
