import React from 'react';
import { ToggleGroup, ToggleGroupItem, Flex, FlexItem } from '@patternfly/react-core';
import { useNamingMode } from '../contexts/NamingModeContext';

export const NamingModeToggle: React.FC = () => {
  const { namingMode, setNamingMode } = useNamingMode();

  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
      <FlexItem>
        <span style={{ fontSize: '0.875rem', color: '#666' }}>
          Showing:
        </span>
      </FlexItem>
      <FlexItem>
        <ToggleGroup 
          isCompact
          aria-label="Naming mode selection"
        >
                 <ToggleGroupItem
                   text="Semantic"
                   buttonId="semantic-mode"
                   isSelected={namingMode === 'semantic'}
                   onChange={() => setNamingMode('semantic')}
                 />
                 <ToggleGroupItem
                   text="Regular"
                   buttonId="regular-mode"
                   isSelected={namingMode === 'regular'}
                   onChange={() => setNamingMode('regular')}
                 />
        </ToggleGroup>
      </FlexItem>
    </Flex>
  );
};
