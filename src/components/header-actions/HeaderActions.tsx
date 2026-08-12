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

const mainTabs = [
  { label: 'Summary', value: 'supplyChain' },
  { label: 'Service Measure', value: 'serviceMeasure' },
  { label: 'Dispatch & WIP', value: 'dispatchWip' },
  { label: 'RD Status', value: 'regionalDistributor' },
] as const;

export function HeaderActions() {
  const dispatch = useAppDispatch();
  const { mainTab /*activeTab, displayMode*/ } = useAppSelector(
    (state) => state.salesDashboard
  );

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
        {mainTabs.map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={mainTab === tab.value ? 'primary' : 'gray'}
            onClick={() => {
              dispatch(
                setMainTab(
                  tab.value as
                    | 'supplyChain'
                    | 'serviceMeasure'
                    | 'dispatchWip'
                    | 'regionalDistributor'
                )
              );
              dispatch(setActiveTab('visualizations'));
              if (tab.value === 'dispatchWip') {
                dispatch(setFilter({ key: 'branch', value: [] }));
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
