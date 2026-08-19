import React from 'react';
import { ScrollView, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Row } from '@/components/Row';
import { Card } from '@/components/Card';
import { StatTile } from '@/components/StatTile';
import { ProgressBar } from '@/components/ProgressBar';
import { EmptyState } from '@/components/EmptyState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, space } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { rewards, transactions, userPoints } from '@/lib/mock-data';

const cheapest = [...rewards].sort((a, b) => a.cost - b.cost)[0];

export default function MyPointsScreen() {
  const { t, lang } = useLang();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('points.title')} />
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxxl }}>
        <Card style={{ marginBottom: space.lg }}>
          <AppText variant="muted">{t('points.balance')}</AppText>
          <AppText variant="mono" style={{ fontSize: 34, marginBottom: space.md }}>
            {userPoints}
          </AppText>
          <ProgressBar value={userPoints} max={cheapest.cost} />
          <AppText variant="muted" style={{ marginTop: space.sm, fontSize: 12.5 }}>
            {t('points.nextReward', { name: lang === 'ar' ? cheapest.nameAr : cheapest.nameEn })}
          </AppText>
        </Card>

        <Card style={{ marginBottom: space.lg }}>
          <Row>
            <StatTile value={0} label={t('points.redeemedStat')} />
            <StatTile value={0} label={t('points.visitsStat')} />
            <StatTile value={0} label={t('points.expiredStat')} />
          </Row>
        </Card>

        <Card style={{ marginBottom: space.lg }}>
          <AppText variant="bodySemiBold" style={{ marginBottom: space.sm }}>
            {t('points.howToEarn')}
          </AppText>
          <View style={{ gap: space.xs }}>
            <AppText variant="muted">• {t('points.earnCheckin')}</AppText>
            <AppText variant="muted">• {t('points.earnOrder')}</AppText>
            <AppText variant="muted">• {t('points.earnInvite')}</AppText>
          </View>
        </Card>

        <AppText variant="bodySemiBold" style={{ marginBottom: space.sm }}>
          {t('points.history')}
        </AppText>
        {transactions.length === 0 ? (
          <EmptyState icon="time-outline" title={t('points.emptyHistory')} />
        ) : (
          <View style={{ gap: space.sm }}>
            {transactions.map((tx) => (
              <Card key={tx.id} style={{ paddingVertical: space.md }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <AppText variant="bodyMedium">{lang === 'ar' ? tx.labelAr : tx.labelEn}</AppText>
                    <AppText variant="muted" style={{ fontSize: 12 }}>
                      {tx.date}
                    </AppText>
                  </View>
                  <AppText variant="mono" color={colors.good}>
                    +{tx.points}
                  </AppText>
                </Row>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
