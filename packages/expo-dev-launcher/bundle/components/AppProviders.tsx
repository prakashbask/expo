import { NavigationContainer } from '@react-navigation/native';
import { darkNavigationTheme, lightNavigationTheme } from 'expo-dev-client-components';
import * as React from 'react';
import { StatusBar, useColorScheme } from 'react-native';

import { UserData } from '../functions/getUserProfileAsync';
import { BuildInfoProvider } from '../hooks/useBuildInfo';
import { CrashReportProvider } from '../hooks/useCrashReport';
import { DevMenuPreferencesProvider } from '../hooks/useDevMenuPreferences';
import { DevSessionsProvider } from '../hooks/useDevSessions';
import { ModalProvider } from '../hooks/useModalStack';
import { PendingDeepLinkProvider } from '../hooks/usePendingDeepLink';
import { RecentApp, RecentlyOpenedAppsProvider } from '../hooks/useRecentlyOpenedApps';
import { UserContextProvider } from '../hooks/useUser';
import { BuildInfo, CrashReport } from '../native-modules/DevLauncherInternal';
import { DevMenuPreferencesType } from '../native-modules/DevMenuPreferences';
import { DevSession } from '../types';

export type AppProvidersProps = {
  children?: React.ReactNode;
  initialUserData?: UserData;
  initialDevMenuPreferences?: DevMenuPreferencesType;
  initialDevSessions?: DevSession[];
  initialBuildInfo?: BuildInfo;
  initialPendingDeepLink?: string;
  initialRecentlyOpenedApps?: RecentApp[];
  initialCrashReport?: CrashReport;
};

export function AppProviders({
  children,
  initialUserData,
  initialDevMenuPreferences,
  initialDevSessions,
  initialBuildInfo,
  initialPendingDeepLink,
  initialRecentlyOpenedApps,
  initialCrashReport,
}: AppProvidersProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const statusBarContent = isDark ? 'light-content' : 'dark-content';

  return (
    <UserContextProvider initialUserData={initialUserData}>
      <DevMenuPreferencesProvider initialSettings={initialDevMenuPreferences}>
        <DevSessionsProvider initialDevSessions={initialDevSessions}>
          <RecentlyOpenedAppsProvider initialApps={initialRecentlyOpenedApps}>
            <BuildInfoProvider initialBuildInfo={initialBuildInfo}>
              <CrashReportProvider initialCrashReport={initialCrashReport}>
                <ModalProvider>
                  <PendingDeepLinkProvider initialPendingDeepLink={initialPendingDeepLink}>
                    <NavigationContainer
                      theme={isDark ? darkNavigationTheme : lightNavigationTheme}>
                      <StatusBar barStyle={statusBarContent} />
                      {children}
                    </NavigationContainer>
                  </PendingDeepLinkProvider>
                </ModalProvider>
              </CrashReportProvider>
            </BuildInfoProvider>
          </RecentlyOpenedAppsProvider>
        </DevSessionsProvider>
      </DevMenuPreferencesProvider>
    </UserContextProvider>
  );
}
