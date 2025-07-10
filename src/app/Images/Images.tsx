import * as React from 'react';
import { 
  PageSection, 
  Title, 
  Button,
  Alert,
  AlertVariant,
  AlertActionCloseButton,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Badge,
  Label,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Pagination,
  ClipboardCopy,
  Tooltip,
  Divider
} from '@patternfly/react-core';
import { EllipsisVIcon, FilterIcon, TableIcon, MigrationIcon, CopyIcon, BuildIcon, StarIcon, OutlinedStarIcon, AngleRightIcon, AngleDownIcon, ExclamationTriangleIcon, InfoCircleIcon } from '@patternfly/react-icons';
import { ImageInfo, MigrationData } from '../Dashboard/ImageMigrationModal';

interface ImageTableRow extends ImageInfo {
  id: string;
  status: 'ready' | 'expired' | 'build failed';
  lastUpdate: string;
  dateUpdated: Date;
  targetEnvironment: 'AWS' | 'GCP' | 'Azure' | 'Bare metal' | 'VMWare';
  version: string;
  owner: string;
  isFavorited: boolean;
  uuid: string;
  architecture: 'x86_64' | 'aarch64';
  fileExtension: string;
}

const Images: React.FunctionComponent = () => {
  const [alertInfo, setAlertInfo] = React.useState<{
    variant: AlertVariant;
    title: string;
    message: string;
  } | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [openDropdowns, setOpenDropdowns] = React.useState<Set<string>>(new Set());
  const [primaryFilter, setPrimaryFilter] = React.useState<string>('name');
  const [secondaryFilter, setSecondaryFilter] = React.useState<string>('');
  const [isPrimaryFilterOpen, setIsPrimaryFilterOpen] = React.useState(false);
  const [isSecondaryFilterOpen, setIsSecondaryFilterOpen] = React.useState(false);
  const [favoritesFilter, setFavoritesFilter] = React.useState<string>('all');
  const [isFavoritesFilterOpen, setIsFavoritesFilterOpen] = React.useState(false);
  const [nameSearchText, setNameSearchText] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<string>('dateUpdated');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  // Sample image data
  const [imageData, setImageData] = React.useState<ImageTableRow[]>([
    {
      id: '1',
      name: 'sample-image-1',
      tag: 'v2.1.0',
      currentRelease: 'RHEL 9',
      currentEnvironment: 'AWS',
      status: 'ready',
      lastUpdate: '2024-01-15 14:30:25',
      dateUpdated: new Date('2024-01-15'),
      targetEnvironment: 'AWS',
      version: '2',
      owner: 'DevOps Team',
      isFavorited: true,
      uuid: '7fb34b5c-c0d4-40ab-b112-a8492d6ee61b',
      architecture: 'x86_64',
      fileExtension: '.qcow2'
    },
    {
      id: '2', 
      name: 'sample-image-2',
      tag: 'v1.8.2',
      currentRelease: 'RHEL 8',
      currentEnvironment: 'GCP',
      status: 'ready',
      lastUpdate: '2024-01-14 09:15:40',
      dateUpdated: new Date('2024-01-14'),
      targetEnvironment: 'GCP',
      version: '1',
      owner: 'Backend Team',
      isFavorited: false,
      uuid: 'a2c5f8e1-9b3d-4f7a-8e2c-1d5b7f9a3c6e',
      architecture: 'aarch64',
      fileExtension: '.qcow2'
    },
    {
      id: '3',
      name: 'sample-image-3',
      tag: 'v3.0.0-beta',
      currentRelease: 'RHEL 10',
      currentEnvironment: 'Azure',
      status: 'build failed',
      lastUpdate: '2024-01-15 16:45:12',
      dateUpdated: new Date('2024-01-15'),
      targetEnvironment: 'Azure',
      version: '3',
      owner: 'Data Team',
      isFavorited: false,
      uuid: 'f3e7d2a9-5c8b-4a1f-9e6d-2b5a8c1f4e7a',
      architecture: 'x86_64',
      fileExtension: '.qcow2'
    },
    {
      id: '4',
      name: 'sample-image-4',
      tag: 'v1.5.3',
      currentRelease: 'RHEL 9',
      currentEnvironment: 'Bare metal',
      status: 'ready',
      lastUpdate: '2024-01-13 11:20:18',
      dateUpdated: new Date('2024-01-13'),
      targetEnvironment: 'Bare metal',
      version: '1',
      owner: 'Security Team',
      isFavorited: true,
      uuid: 'b8d4c2f6-7a9e-4b3c-8f1d-5e2a9c6b8d4f',
      architecture: 'aarch64',
      fileExtension: '.iso'
    },
    {
      id: '5',
      name: 'sample-image-5',
      tag: 'v2.3.1',
      currentRelease: 'RHEL 8',
      currentEnvironment: 'GCP',
      status: 'expired',
      lastUpdate: '2023-10-12 08:45:30',
      dateUpdated: new Date('2023-10-12'),
      targetEnvironment: 'GCP',
      version: '2',
      owner: 'SRE Team',
      isFavorited: false,
      uuid: 'e9a3b7f2-4d6c-4e8a-9b2f-7c4e1a6b9d3e',
      architecture: 'x86_64',
      fileExtension: '.qcow2'
    },
    {
      id: '6',
      name: 'sample-image-6',
      tag: 'v1.2.0',
      currentRelease: 'RHEL 9',
      currentEnvironment: 'AWS',
      status: 'build failed',
      lastUpdate: '2024-01-15 13:22:44',
      dateUpdated: new Date('2024-01-15'),
      targetEnvironment: 'AWS',
      version: '1',
      owner: 'Platform Team',
      isFavorited: false,
      uuid: 'c5f8a1d3-6b2e-4c9f-8a5d-3f7b2e9c5a8d',
      architecture: 'aarch64',
      fileExtension: '.tar.gz'
    }
  ]);

  // Reset pagination when filters change
  React.useEffect(() => {
    setPage(1);
  }, [primaryFilter, secondaryFilter, favoritesFilter, sortField, sortDirection]);

  const handleMigrationClick = (image?: ImageInfo) => {
    setAlertInfo({
      variant: AlertVariant.info,
      title: 'Migration Feature',
      message: `We don't need to build this right now.`,
    });
  };

  const capitalizeWords = (str: string) => {
    return str.split(' ')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
             .join(' ');
  };

  const getStatusBadge = (status: string, targetEnvironment?: string) => {
    const statusMap = {
      'ready': { color: 'green' as const, variant: 'outline' as const },
      'expired': { color: 'orange' as const, variant: 'outline' as const },
      'build failed': { color: 'red' as const, variant: 'outline' as const }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.expired;
    
    if (status === 'expired') {
      const isCloudEnvironment = targetEnvironment && ['AWS', 'GCP', 'Azure'].includes(targetEnvironment);
      const statusLabel = (
        <Label color={config.color} variant={config.variant}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ExclamationTriangleIcon style={{ fontSize: '0.875rem', color: '#f0ab00' }} />
            <span>{capitalizeWords(status)}</span>
          </span>
        </Label>
      );

      if (isCloudEnvironment) {
        return (
          <Tooltip
            content={
              <div style={{ maxWidth: '300px' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Why did this image expire?</strong>
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  Images built for cloud environments ({targetEnvironment}) expire after 2 weeks 
                  because they're hosted temporarily in Red Hat's cloud account.
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Solution:</strong> Use the toolbar above to rebuild this image, 
                  then copy it to your own {targetEnvironment} account.
                </p>
              </div>
            }
            position="top"
          >
            {statusLabel}
          </Tooltip>
        );
      }
      
      return statusLabel;
    }
    
    return (
      <Label color={config.color} variant={config.variant}>
        {capitalizeWords(status)}
      </Label>
    );
  };

  // Filter and sort images
  const { paginatedImages, totalFilteredCount } = React.useMemo(() => {
    let filtered = [...imageData];

    // Apply favorites filter first (always available)
    if (favoritesFilter === 'favorites') {
      filtered = filtered.filter(image => image.isFavorited);
    } else if (favoritesFilter === 'non-favorites') {
      filtered = filtered.filter(image => !image.isFavorited);
    }

    // Apply primary filter name search
    if (primaryFilter === 'name' && nameSearchText.trim()) {
      filtered = filtered.filter(image => 
        image.name.toLowerCase().includes(nameSearchText.toLowerCase())
      );
    }

    // Apply filters based on primary and secondary filter selections
    if (primaryFilter && secondaryFilter) {
      switch (primaryFilter) {
        case 'target environment':
          filtered = filtered.filter(image => image.targetEnvironment === secondaryFilter);
          break;
        case 'os':
          filtered = filtered.filter(image => image.currentRelease === secondaryFilter);
          break;
        case 'status':
          filtered = filtered.filter(image => image.status === secondaryFilter);
          break;
        case 'last update':
          const now = new Date();
          const cutoffDate = new Date();
          switch (secondaryFilter) {
            case 'in the last 30 days':
              cutoffDate.setDate(now.getDate() - 30);
              break;
            case 'in the last 90 days':
              cutoffDate.setDate(now.getDate() - 90);
              break;
            case 'in the last 1 year':
              cutoffDate.setFullYear(now.getFullYear() - 1);
              break;
          }
          filtered = filtered.filter(image => image.dateUpdated >= cutoffDate);
          break;
      }
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortField) {
          case 'image':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'dateUpdated':
            aValue = a.dateUpdated;
            bValue = b.dateUpdated;
            break;
          case 'os':
            aValue = a.currentRelease;
            bValue = b.currentRelease;
            break;
          case 'targetEnvironment':
            aValue = a.targetEnvironment;
            bValue = b.targetEnvironment;
            break;
          case 'version':
            aValue = a.version;
            bValue = b.version;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'owner':
            aValue = a.owner;
            bValue = b.owner;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const totalCount = filtered.length;
    
    // Apply pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedResults = filtered.slice(startIndex, endIndex);
    
    return {
      paginatedImages: paginatedResults,
      totalFilteredCount: totalCount
    };
  }, [imageData, primaryFilter, secondaryFilter, favoritesFilter, nameSearchText, sortField, sortDirection, page, perPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    const icon = sortDirection === 'asc' ? ' ↑' : ' ↓';
    
    return (
      <span style={{ fontSize: '0.875rem', color: '#666' }}>
        {icon}
      </span>
    );
  };

  const getSortTooltipText = (field: string, direction: 'asc' | 'desc') => {
    if (field === 'dateUpdated') {
      return direction === 'desc' ? 'Latest first' : 'Oldest first';
    }
    return direction === 'asc' ? 'A-Z' : 'Z-A';
  };

  const getPrimaryFilterOptions = () => [
    'name',
    'target environment', 
    'os',
    'status',
    'last update'
  ];

  const getSecondaryFilterOptions = () => {
    switch (primaryFilter) {
      case 'name':
        return []; // No secondary options for name filter - just use search
      case 'target environment':
        return ['AWS', 'GCP', 'Azure', 'Bare metal', 'VMWare'];
      case 'os':
        return ['RHEL 10', 'RHEL 9', 'RHEL 8'];
      case 'status':
        return ['ready', 'expired', 'build failed'];
      case 'last update':
        return ['in the last 30 days', 'in the last 90 days', 'in the last 1 year'];
      default:
        return [];
    }
  };

  const getSecondaryFilterPlaceholder = () => {
    switch (primaryFilter) {
      case 'name':
        return 'Search image names...';
      case 'target environment':
        return 'Select target environment';
      case 'os':
        return 'Select OS';
      case 'status':
        return 'Select status';
      case 'last update':
        return 'Last update was within';
      default:
        return 'Select option';
    }
  };

  const onPrimaryFilterSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    const selectedValue = String(selection);
    if (primaryFilter === selectedValue) {
      setPrimaryFilter('');
      setSecondaryFilter('');
    } else {
      setPrimaryFilter(selectedValue);
      setSecondaryFilter('');
    }
    setIsPrimaryFilterOpen(false);
  };

  const onSecondaryFilterSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    const selectedValue = String(selection);
    if (secondaryFilter === selectedValue) {
      setSecondaryFilter('');
    } else {
      setSecondaryFilter(selectedValue);
    }
    setIsSecondaryFilterOpen(false);
  };

  const onFavoritesFilterSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    const selectedValue = String(selection);
    if (favoritesFilter === selectedValue) {
      setFavoritesFilter('all');
    } else {
      setFavoritesFilter(selectedValue);
    }
    setIsFavoritesFilterOpen(false);
  };

  const toggleRowSelection = (imageId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedRows(newSelected);
  };

  const toggleFavorite = (imageId: string) => {
    setImageData(prev => prev.map(image => 
      image.id === imageId 
        ? { ...image, isFavorited: !image.isFavorited }
        : image
    ));
  };

  const toggleDropdown = (imageId: string) => {
    const newOpen = new Set(openDropdowns);
    if (newOpen.has(imageId)) {
      newOpen.delete(imageId);
    } else {
      newOpen.clear();
      newOpen.add(imageId);
    }
    setOpenDropdowns(newOpen);
  };

  const toggleRowExpansion = (imageId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(imageId)) {
      newExpanded.delete(imageId);
    } else {
      newExpanded.add(imageId);
    }
    setExpandedRows(newExpanded);
  };

  const handleBulkMigration = () => {
    if (selectedRows.size === 0) return;
    
    setAlertInfo({
      variant: AlertVariant.info,
      title: 'Migration Feature',
      message: `We don't need to build this right now.`,
    });
  };

  const duplicateImage = (image: ImageTableRow) => {
    const duplicatedImage = {
      ...image,
      id: `copy-${Date.now()}-${image.id}`,
      name: `Copy of ${image.name}`,
      tag: `Copy of ${image.tag}`,
      lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      dateUpdated: new Date(),
    };
    
    setImageData(prevData => {
      const originalIndex = prevData.findIndex(img => img.id === image.id);
      const newData = [...prevData];
      newData.splice(originalIndex + 1, 0, duplicatedImage);
      return newData;
    });
    
    setAlertInfo({
      variant: AlertVariant.success,
      title: 'Image Duplicated',
      message: `Successfully duplicated "${image.name}" as "${duplicatedImage.name}"`,
    });
  };

  const handleBulkDuplicate = () => {
    if (selectedRows.size === 0) return;
    
    const selectedImages = imageData.filter(img => selectedRows.has(img.id));
    const selectedImageNames = selectedImages.map(img => img.name);
    
    setImageData(prevData => {
      let newData = [...prevData];
      
      const sortedSelectedImages = selectedImages
        .map(img => ({ img, index: newData.findIndex(item => item.id === img.id) }))
        .sort((a, b) => b.index - a.index);
      
      sortedSelectedImages.forEach(({ img, index }) => {
        const duplicatedImage = {
          ...img,
          id: `copy-${Date.now()}-${img.id}`,
          name: `Copy of ${img.name}`,
          tag: `Copy of ${img.tag}`,
          lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19),
          dateUpdated: new Date(),
        };
        newData.splice(index + 1, 0, duplicatedImage);
      });
      
      return newData;
    });
    
    setSelectedRows(new Set());
    
    setAlertInfo({
      variant: AlertVariant.success,
      title: 'Images Duplicated',
      message: `Successfully duplicated ${selectedRows.size} image${selectedRows.size > 1 ? 's' : ''}: ${selectedImageNames.join(', ')}`,
    });
  };

  const handleBulkRebuild = () => {
    if (selectedRows.size === 0) return;
    
    const selectedImageNames = Array.from(selectedRows)
      .map(id => imageData.find(img => img.id === id)?.name)
      .filter(Boolean);
    
    setAlertInfo({
      variant: AlertVariant.info,
      title: 'Rebuild Operation',
      message: `Rebuilding ${selectedRows.size} selected image${selectedRows.size > 1 ? 's' : ''}: ${selectedImageNames.join(', ')}`,
    });
  };

  const deleteImage = (image: ImageTableRow) => {
    setImageData(prevData => prevData.filter(img => img.id !== image.id));
    
    setAlertInfo({
      variant: AlertVariant.success,
      title: 'Image Deleted',
      message: `Successfully deleted "${image.name}"`,
    });
  };


  
  return (
    <>
      {/* Toast notification */}
      {alertInfo && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 99999,
          maxWidth: '400px',
          minWidth: '300px'
        }}>
          <Alert
            variant={alertInfo.variant}
            title={alertInfo.title}
            actionClose={
              <AlertActionCloseButton onClose={() => setAlertInfo(null)} />
            }
            style={{ 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              animation: 'slideInFromRight 0.3s ease-out',
              margin: 0
            }}
          >
            {alertInfo.message}
          </Alert>
        </div>
      )}

      <PageSection hasBodyWrapper={false} style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '1.5rem', 
          flexShrink: 0
        }}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h1" size="lg">
                <TableIcon style={{ marginRight: '0.5rem' }} />
                HMS-8807
              </Title>
              <p style={{ marginTop: '0.5rem', color: '#666' }}>
                View and manage your system images
              </p>
            </FlexItem>
            <FlexItem>
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <Button variant="secondary" isDisabled>
                    Build Image
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button variant="secondary" isDisabled>
                    Use a Base Image
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button variant="secondary" isDisabled>
                    Import
                  </Button>
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        </div>

        {/* Scrollable Table Container */}
        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <CardBody style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Toolbar style={{ 
              padding: '1rem 1.5rem',
              border: '1px solid #d2d2d2',
              borderBottom: 'none'
            }}>
              <ToolbarContent>
                <ToolbarItem>
                  <div style={{ width: '180px' }}>
                    <Dropdown
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle 
                          ref={toggleRef}
                          onClick={() => setIsPrimaryFilterOpen(!isPrimaryFilterOpen)}
                          isExpanded={isPrimaryFilterOpen}
                          icon={<FilterIcon />}
                          style={{ width: '100%' }}
                        >
                          {primaryFilter ? primaryFilter.charAt(0).toUpperCase() + primaryFilter.slice(1) : 'Filter by'}
                        </MenuToggle>
                      )}
                      isOpen={isPrimaryFilterOpen}
                      onOpenChange={setIsPrimaryFilterOpen}
                      onSelect={onPrimaryFilterSelect}
                    >
                      <DropdownList>
                        {getPrimaryFilterOptions().map(option => (
                          <DropdownItem 
                            key={option} 
                            value={option}
                            isSelected={primaryFilter === option}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </DropdownItem>
                        ))}
                      </DropdownList>
                    </Dropdown>
                  </div>
                </ToolbarItem>
                <ToolbarItem>
                  {primaryFilter === 'name' ? (
                    <div style={{ width: '220px' }}>
                      <SearchInput
                        placeholder="Search image names..."
                        value={nameSearchText}
                        onChange={(_event, value) => setNameSearchText(value)}
                        onClear={() => setNameSearchText('')}
                      />
                    </div>
                  ) : primaryFilter && getSecondaryFilterOptions().length > 0 ? (
                    <div style={{ width: '220px' }}>
                      <Dropdown
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle 
                            ref={toggleRef}
                            onClick={() => setIsSecondaryFilterOpen(!isSecondaryFilterOpen)}
                            isExpanded={isSecondaryFilterOpen}
                            style={{ width: '100%' }}
                          >
                            {secondaryFilter ? secondaryFilter.charAt(0).toUpperCase() + secondaryFilter.slice(1) : getSecondaryFilterPlaceholder()}
                          </MenuToggle>
                        )}
                        isOpen={isSecondaryFilterOpen}
                        onOpenChange={setIsSecondaryFilterOpen}
                        onSelect={onSecondaryFilterSelect}
                      >
                        <DropdownList>
                          {getSecondaryFilterOptions().map(option => (
                            <DropdownItem 
                              key={option} 
                              value={option}
                              isSelected={secondaryFilter === option}
                            >
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </DropdownItem>
                          ))}
                        </DropdownList>
                      </Dropdown>
                    </div>
                  ) : null}
                </ToolbarItem>
                
                {/* Always-visible favorites filter */}
                <ToolbarItem>
                  <div style={{ width: '180px' }}>
                    <Dropdown
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle 
                          ref={toggleRef}
                          onClick={() => setIsFavoritesFilterOpen(!isFavoritesFilterOpen)}
                          isExpanded={isFavoritesFilterOpen}
                          style={{ width: '100%' }}
                        >
                          {favoritesFilter === 'all' ? 'All images' : 
                           favoritesFilter === 'favorites' ? 'Favorites only' : 
                           'Non-favorites only'}
                        </MenuToggle>
                      )}
                      isOpen={isFavoritesFilterOpen}
                      onOpenChange={setIsFavoritesFilterOpen}
                      onSelect={onFavoritesFilterSelect}
                    >
                      <DropdownList>
                        <DropdownItem 
                          key="all" 
                          value="all"
                          isSelected={favoritesFilter === 'all'}
                        >
                          All images
                        </DropdownItem>
                        <DropdownItem 
                          key="favorites" 
                          value="favorites"
                          isSelected={favoritesFilter === 'favorites'}
                        >
                          Favorites only
                        </DropdownItem>
                        <DropdownItem 
                          key="non-favorites" 
                          value="non-favorites"
                          isSelected={favoritesFilter === 'non-favorites'}
                        >
                          Non-favorites only
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </div>
                </ToolbarItem>

                <ToolbarItem>
                  <Button
                    variant="secondary"
                    icon={<MigrationIcon />}
                    onClick={handleBulkMigration}
                    isDisabled={selectedRows.size === 0}
                  >
                    Migrate ({selectedRows.size})
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    variant="secondary"
                    icon={<CopyIcon />}
                    onClick={handleBulkDuplicate}
                    isDisabled={selectedRows.size === 0}
                  >
                    Duplicate ({selectedRows.size})
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    variant="secondary"
                    icon={<BuildIcon />}
                    onClick={handleBulkRebuild}
                    isDisabled={selectedRows.size === 0}
                  >
                    Rebuild ({selectedRows.size})
                  </Button>
                </ToolbarItem>

              </ToolbarContent>
            </Toolbar>

            {/* Scrollable Table Implementation */}
            <div style={{ 
              flex: 1, 
              overflow: 'auto', 
              border: '1px solid #d2d2d2',
              borderTop: 'none',
              borderBottom: 'none',
              minHeight: 0,
              position: 'relative'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ 
                  borderBottom: '1px solid #d2d2d2', 
                  backgroundColor: 'white'
                }}>
                  <tr>
                    <th style={{ padding: '1rem 0.5rem 1rem 1.5rem', textAlign: 'left', fontWeight: 600, width: '40px' }}></th>
                    <th style={{ padding: '1rem 0.75rem 1rem 1.5rem', textAlign: 'left', fontWeight: 600, width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.size === paginatedImages.length && paginatedImages.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(new Set(paginatedImages.map(img => img.id)));
                          } else {
                            setSelectedRows(new Set());
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                    <th style={{ padding: '1rem 0.5rem' }}></th>
                    <th 
                      style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => handleSort('image')}
                    >
                      {sortField === 'image' ? (
                        <Tooltip content={getSortTooltipText('image', sortDirection)}>
                          <span>Image{getSortIcon('image')}</span>
                        </Tooltip>
                      ) : (
                        <>Image{getSortIcon('image')}</>
                      )}
                    </th>
                    <th 
                      style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => handleSort('dateUpdated')}
                    >
                      {sortField === 'dateUpdated' ? (
                        <Tooltip content={getSortTooltipText('dateUpdated', sortDirection)}>
                          <span>Date Updated{getSortIcon('dateUpdated')}</span>
                        </Tooltip>
                      ) : (
                        <>Date Updated{getSortIcon('dateUpdated')}</>
                      )}
                    </th>
                    <th 
                      style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => handleSort('os')}
                    >
                      {sortField === 'os' ? (
                        <Tooltip content={getSortTooltipText('os', sortDirection)}>
                          <span>OS{getSortIcon('os')}</span>
                        </Tooltip>
                      ) : (
                        <>OS{getSortIcon('os')}</>
                      )}
                    </th>
                    <th 
                      style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => handleSort('targetEnvironment')}
                    >
                      {sortField === 'targetEnvironment' ? (
                        <Tooltip content={getSortTooltipText('targetEnvironment', sortDirection)}>
                          <span>Target Environment{getSortIcon('targetEnvironment')}</span>
                        </Tooltip>
                      ) : (
                        <>Target Environment{getSortIcon('targetEnvironment')}</>
                      )}
                    </th>
                    <th 
                      style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => handleSort('version')}
                    >
                      {sortField === 'version' ? (
                        <Tooltip content={getSortTooltipText('version', sortDirection)}>
                          <span>Version{getSortIcon('version')}</span>
                        </Tooltip>
                      ) : (
                        <>Version{getSortIcon('version')}</>
                      )}
                    </th>
                    <th 
                      style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => handleSort('status')}
                    >
                      {sortField === 'status' ? (
                        <Tooltip content={getSortTooltipText('status', sortDirection)}>
                          <span>Status{getSortIcon('status')}</span>
                        </Tooltip>
                      ) : (
                        <>Status{getSortIcon('status')}</>
                      )}
                    </th>
                    <th 
                      style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => handleSort('owner')}
                    >
                      {sortField === 'owner' ? (
                        <Tooltip content={getSortTooltipText('owner', sortDirection)}>
                          <span>Owner{getSortIcon('owner')}</span>
                        </Tooltip>
                      ) : (
                        <>Owner{getSortIcon('owner')}</>
                      )}
                    </th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}> </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedImages.map((image, index) => (
                    <React.Fragment key={image.id}>
                      <tr 
                        style={{ 
                          borderBottom: expandedRows.has(image.id) ? 'none' : (index < paginatedImages.length - 1 ? '1px solid #f0f0f0' : 'none'),
                          backgroundColor: selectedRows.has(image.id) ? '#f0f8ff' : 'white',
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleRowSelection(image.id)}
                      >
                        <td style={{ padding: '1rem 0.5rem 1rem 1.5rem' }} onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="plain"
                            onClick={() => toggleRowExpansion(image.id)}
                            style={{ padding: '0.25rem', minWidth: 'auto' }}
                          >
                            {expandedRows.has(image.id) ? (
                              <AngleDownIcon style={{ fontSize: '0.875rem' }} />
                            ) : (
                              <AngleRightIcon style={{ fontSize: '0.875rem' }} />
                            )}
                          </Button>
                        </td>
                        <td style={{ padding: '1rem 0.75rem 1rem 1.5rem' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(image.id)}
                          onChange={() => toggleRowSelection(image.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="plain"
                          onClick={() => toggleFavorite(image.id)}
                          aria-label={`${image.isFavorited ? 'Remove from' : 'Add to'} favorites`}
                          style={{ padding: '0.25rem' }}
                        >
                          {image.isFavorited ? (
                            <StarIcon style={{ color: '#f39c12' }} />
                          ) : (
                            <OutlinedStarIcon style={{ color: '#666' }} />
                          )}
                        </Button>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <strong>{image.name}</strong>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9em', color: '#666' }}>
                        {image.dateUpdated.toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>{image.currentRelease}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{image.targetEnvironment}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <code style={{ 
                          backgroundColor: '#f5f5f5', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '3px',
                          fontSize: '0.9em'
                        }}>
                          {image.version}
                        </code>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(image.status, image.targetEnvironment)}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{image.owner}</td>
                      <td style={{ padding: '1rem 1.5rem' }} onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle 
                              ref={toggleRef}
                              variant="plain"
                              onClick={() => toggleDropdown(image.id)}
                              isExpanded={openDropdowns.has(image.id)}
                              aria-label={`Actions for ${image.name}`}
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                          isOpen={openDropdowns.has(image.id)}
                          onOpenChange={(isOpen) => {
                            if (!isOpen) {
                              setOpenDropdowns(new Set());
                            }
                          }}
                        >
                          <DropdownList>
                            <DropdownItem isDisabled>
                              Edit (disabled)
                            </DropdownItem>
                            <Divider />
                            <DropdownItem 
                              onClick={() => {
                                handleMigrationClick(image);
                                setOpenDropdowns(new Set());
                              }}
                            >
                              Migrate
                            </DropdownItem>
                            <DropdownItem 
                              onClick={() => {
                                duplicateImage(image);
                                setOpenDropdowns(new Set());
                              }}
                            >
                              Duplicate
                            </DropdownItem>
                            <DropdownItem 
                              onClick={() => {
                                console.log(`Rebuilding ${image.name}`);
                                setOpenDropdowns(new Set());
                              }}
                            >
                              Rebuild
                            </DropdownItem>
                            <DropdownItem 
                              onClick={() => {
                                console.log(`Downloading ${image.name}`);
                                setOpenDropdowns(new Set());
                              }}
                            >
                              Download
                            </DropdownItem>
                            <Divider />
                            <DropdownItem 
                              isDanger
                              onClick={() => {
                                deleteImage(image);
                                setOpenDropdowns(new Set());
                              }}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </td>
                    </tr>
                    {expandedRows.has(image.id) && (
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <td colSpan={11} style={{ padding: '1.5rem', borderBottom: index < paginatedImages.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                          <div>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Build information</h4>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                              <div><strong>Architecture:</strong> {image.architecture}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <strong>UUID:</strong>
                                <ClipboardCopy 
                                  isReadOnly 
                                  hoverTip="Copy UUID" 
                                  clickTip="UUID copied!"
                                  variant="inline-compact"
                                >
                                  {image.uuid}
                                </ClipboardCopy>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              
              {paginatedImages.length === 0 && totalFilteredCount === 0 && (
                <div style={{ 
                  padding: '3rem', 
                  textAlign: 'center', 
                  color: '#666',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <p>
                    No images found matching your search criteria.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            {totalFilteredCount > 0 && (
              <Pagination
                itemCount={totalFilteredCount}
                perPage={perPage}
                page={page}
                onSetPage={(_event, newPage) => setPage(newPage)}
                onPerPageSelect={(_event, newPerPage, newPage) => {
                  setPerPage(newPerPage);
                  setPage(newPage);
                }}
                widgetId="pagination-options-menu-top"
                style={{ 
                  padding: '1rem 1.5rem', 
                  border: '1px solid #d2d2d2',
                  borderTop: '1px solid #d2d2d2',
                  backgroundColor: 'white'
                }}
              />
            )}
          </CardBody>
        </Card>


      </PageSection>
    </>
  );
};

export { Images }; 