import { useEffect, useMemo } from 'react';
import { permissionCode, usePermissions } from '@/api/permissions';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button } from '@/components/button';
import { colors } from '@/constants/theme';
import {
  setActiveTab,
  // setDisplayMode,
  setMainTab,
  setFilter,
} from '@/features/salesDashboard/salesDashboardSlice';
import { Flex, HStack } from '@chakra-ui/react';
// import { FiBarChart2, FiGrid } from 'react-icons/fi';

/**
 * The tabs, each carrying the permission section_code that governs it.
 *
 * The section code cannot be derived from the redux value — RD Data Status is
 * stored as RD_DATA_STATUS but switched on as 'regionalDistributor' — so the
 * mapping has to be written down somewhere, and this is that somewhere.
 */
const mainTabs = [
  { label: 'Summary', value: 'supplyChain', section: 'SUMMARY' },
  { label: 'Service Measure', value: 'serviceMeasure', section: 'SERVICE_MEASURE' },
  { label: 'Dispatch & WIP', value: 'dispatchWip', section: 'DISPATCH_WIP' },
  { label: 'RD Data Status', value: 'regionalDistributor', section: 'RD_DATA_STATUS' },
] as const;

type MainTabValue = (typeof mainTabs)[number]['value'];

export function HeaderActions() {
  const dispatch = useAppDispatch();
  const { mainTab /*activeTab, displayMode*/ } = useAppSelector(
    (state) => state.salesDashboard
  );

  const { has, isReady } = usePermissions();

  // Only the tabs this user holds a VIEW permission on. Nothing renders until
  // the codes have arrived — showing all four first would flash tabs the user
  // is not entitled to before removing them again.
  const visibleTabs = useMemo(
    () => (isReady ? mainTabs.filter((tab) => has(permissionCode(tab.section))) : []),
    [isReady, has]
  );

  // The selected tab is remembered in redux, so a user can land on one they may
  // no longer open — after a role change, or simply because 'supplyChain' is
  // the initial state for everyone. Fall back to their first allowed tab.
  useEffect(() => {
    if (!isReady || visibleTabs.length === 0) return;
    if (visibleTabs.some((tab) => tab.value === mainTab)) return;
    dispatch(setMainTab(visibleTabs[0].value as MainTabValue));
    dispatch(setActiveTab('visualizations'));
  }, [isReady, visibleTabs, mainTab, dispatch]);

  return (
    <Flex
      justify="space-between"
      align="center"
      wrap="wrap"
      gap={2}
      ml={4}
      grow={1}
    >
      {/* Main Tabs */}
      <HStack
        bg={colors.filterBarBg}
        borderRadius="md"
        p={1}
        boxShadow="md"
        gap={1}
      >
        {visibleTabs.map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={mainTab === tab.value ? 'primary' : 'gray'}
            onClick={() => {
              dispatch(setMainTab(tab.value as MainTabValue));
              dispatch(setActiveTab('visualizations'));
              // RD Status branch codes come from the franchise DB and mean
              // nothing to the other tabs (and vice versa), so the branch
              // selection is dropped whenever that boundary is crossed.
              const crossesRdBoundary =
                tab.value === 'regionalDistributor' ||
                mainTab === 'regionalDistributor';
              if (tab.value === 'dispatchWip' || crossesRdBoundary) {
                dispatch(setFilter({ key: 'branch', value: [] }));
              }
              if (crossesRdBoundary) {
                dispatch(setFilter({ key: 'distributor', value: [] }));
              }
            }}
          >
            {tab.label}
          </Button>
        ))}
      </HStack>

      {/* <HStack gap={2}>
        {(mainTab === 'supplyChain' || mainTab === 'serviceMeasure') && (
            <HStack
              bg={colors.filterBarBg}
              borderRadius="md"
              p={1}
              boxShadow="md"
              gap={1}
            >
              <Button
                size="sm"
                variant={activeTab === 'visualizations' ? 'primary' : 'gray'}
                onClick={() => dispatch(setActiveTab('visualizations'))}
              >
                <FiBarChart2 /> Visualizations
              </Button>
              <Button
                size="sm"
                variant={activeTab === 'tables' ? 'primary' : 'gray'}
                onClick={() => dispatch(setActiveTab('tables'))}
              >
                <FiGrid /> Tables
              </Button>
            </HStack>
          )}
        {mainTab === 'supplyChain' && (
          <HStack
            bg={colors.filterBarBg}
            borderRadius="md"
            p={1}
            boxShadow="md"
            gap={1}
          >
            <Button
              size="sm"
              variant={displayMode === 'TP' ? 'secondary' : 'gray'}
              onClick={() => dispatch(setDisplayMode('TP'))}
            >
              TP Value
            </Button>
            <Button
              size="sm"
              variant={displayMode === 'EFP' ? 'secondary' : 'gray'}
              onClick={() => dispatch(setDisplayMode('EFP'))}
            >
              EFP Value
            </Button>
          </HStack>
        )}
      </HStack> */}
    </Flex>
  );
}
