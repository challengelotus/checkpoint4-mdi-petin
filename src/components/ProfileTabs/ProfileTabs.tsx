import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '@/theme';
import { Typography } from '@/components/Typography/Typography';

export type ProfileTab =
  | 'dados'
  | 'historico'
  | 'documentos';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

const tabs: {
  id: ProfileTab;
  label: string;
}[] = [
  {
    id: 'dados',
    label: 'Dados',
  },
  {
    id: 'historico',
    label: 'Histórico',
  },
  {
    id: 'documentos',
    label: 'Documentos',
  },
];

export function ProfileTabs({
  activeTab,
  onChange,
}: ProfileTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[
              styles.tab,
              active && styles.activeTab,
            ]}
          >
            <Typography
              variant="captionMedium"
              color={
                active
                  ? colors.backgroundLight
                  : colors.brown
              }
            >
              {tab.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,

    marginTop: -2,

    paddingHorizontal: 28,
    paddingBottom: 16,

    backgroundColor: colors.background,
  },

  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,

    borderRadius: 20,

    backgroundColor: colors.backgroundLight,
  },

  activeTab: {
    backgroundColor: colors.brown,
  },
});