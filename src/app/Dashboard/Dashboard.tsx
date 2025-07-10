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
  Divider,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  Pagination,
  Form,
  FormGroup,
  TextInput,
  Select,
  SelectList,
  SelectOption,
  FormHelperText,
  HelperText,
  HelperTextItem,
  ClipboardCopy,
  Tooltip
} from '@patternfly/react-core';
import { EllipsisVIcon, FilterIcon, BuilderImageIcon, MigrationIcon, StarIcon, OutlinedStarIcon, CopyIcon, BuildIcon, DownloadIcon, TrashIcon, TimesIcon, AngleRightIcon, AngleDownIcon, EditIcon, PlayIcon, ExclamationTriangleIcon, InfoCircleIcon } from '@patternfly/react-icons';
import { ImageMigrationModal, ImageInfo, MigrationData } from './ImageMigrationModal';
import { UseBaseImageModal, type ImageItem } from './UseBaseImageModal';
import BuildImageModal from './BuildImageModal';

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

const Dashboard: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isUseBaseImageModalOpen, setIsUseBaseImageModalOpen] = React.useState(false);
  const [isBuildImageModalOpen, setIsBuildImageModalOpen] = React.useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<ImageInfo | null>(null);
  const [imageToDelete, setImageToDelete] = React.useState<ImageTableRow | null>(null);
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
  const [nameSearchText, setNameSearchText] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<string>('dateUpdated');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
  
  // Overlay form state
  const [overlayTargetRelease, setOverlayTargetRelease] = React.useState('');
  const [overlayTargetEnvironment, setOverlayTargetEnvironment] = React.useState('');
  const [isOverlayReleaseSelectOpen, setIsOverlayReleaseSelectOpen] = React.useState(false);
  const [isOverlayEnvironmentSelectOpen, setIsOverlayEnvironmentSelectOpen] = React.useState(false);
  const [isOverlayLoading, setIsOverlayLoading] = React.useState(false);
  const [overlayErrors, setOverlayErrors] = React.useState<{
    targetRelease?: string;
    targetEnvironment?: string;
  }>({});
  const [showDemoAlert, setShowDemoAlert] = React.useState(true);
  
  // Only show demo alert on GitHub Pages, not on localhost
  const isGitHubPages = React.useMemo(() => {
    return typeof window !== 'undefined' && 
           (window.location.hostname.includes('github.io') || 
            window.location.hostname === 'kelseamann.github.io');
  }, []);

  // Reset pagination when filters change
  React.useEffect(() => {
    setPage(1);
  }, [primaryFilter, secondaryFilter, sortField, sortDirection]);

  // Sample image data for the table
  const [imageData, setImageData] = React.useState<ImageTableRow[]>([
    {
      id: '1',
      name: 'web-frontend',
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
      name: 'api-backend',
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
      name: 'data-processor',
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
      name: 'auth-service',
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
      name: 'monitoring-dashboard',
      tag: 'v2.3.1',
      currentRelease: 'RHEL 8',
      currentEnvironment: 'AWS',
      status: 'expired',
      lastUpdate: '2023-10-12 08:45:30',
      dateUpdated: new Date('2023-10-12'),
      targetEnvironment: 'AWS',
      version: '2',
      owner: 'SRE Team',
      isFavorited: false,
      uuid: 'e9a3b7f2-4d6c-4e8a-9b2f-7c4e1a6b9d3e',
      architecture: 'x86_64',
      fileExtension: '.qcow2'
    },
    {
      id: '6',
      name: 'notification-service',
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

  const handleMigrationConfirm = async (migrationData: MigrationData): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure randomly for demo
        if (Math.random() > 0.3) {
          setAlertInfo({
            variant: AlertVariant.success,
            title: 'Migration Successful',
            message: `Image "${selectedImage?.name}" successfully migrated to ${migrationData.targetRelease} in ${migrationData.targetEnvironment} environment.`,
          });
          resolve();
        } else {
          setAlertInfo({
            variant: AlertVariant.danger,
            title: 'Migration Failed',
            message: `Failed to migrate image "${selectedImage?.name}". Please try again or contact support.`,
          });
          reject(new Error('Migration failed'));
        }
      }, 2000);
    });
  };

  const openMigrationModal = (image: ImageInfo) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    // Clear any previous alerts
    setAlertInfo(null);
  };

  const openMigrationOverlay = (image: ImageInfo) => {
    setSelectedImage(image);
    setIsOverlayOpen(true);
    // Clear any previous alerts
    setAlertInfo(null);
    // Reset overlay form
    setOverlayTargetRelease('');
    setOverlayTargetEnvironment('');
    setOverlayErrors({});
  };

  const closeOverlay = () => {
    if (!isOverlayLoading) {
      setIsOverlayOpen(false);
      setSelectedImage(null);
    }
  };

  const validateOverlayForm = (): boolean => {
    const newErrors: typeof overlayErrors = {};
    
    if (!overlayTargetRelease) {
      newErrors.targetRelease = 'Target release is required';
    }
    
    if (!overlayTargetEnvironment) {
      newErrors.targetEnvironment = 'Target environment is required';
    }

    setOverlayErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOverlayConfirm = async () => {
    if (!validateOverlayForm()) {
      return;
    }

    setIsOverlayLoading(true);
    try {
      await handleMigrationConfirm({
        targetRelease: overlayTargetRelease,
        targetEnvironment: overlayTargetEnvironment,
      });
      setIsOverlayOpen(false);
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      setIsOverlayLoading(false);
    }
  };

  const onOverlayReleaseSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    setOverlayTargetRelease(String(selection));
    setIsOverlayReleaseSelectOpen(false);
    if (overlayErrors.targetRelease) {
      setOverlayErrors(prev => ({ ...prev, targetRelease: undefined }));
    }
  };

  const onOverlayEnvironmentSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    setOverlayTargetEnvironment(String(selection));
    setIsOverlayEnvironmentSelectOpen(false);
    if (overlayErrors.targetEnvironment) {
      setOverlayErrors(prev => ({ ...prev, targetEnvironment: undefined }));
    }
  };

  // Available options for overlay form
  const availableReleases = [
    'Red Hat Enterprise Linux 10',
    'Red Hat Enterprise Linux 9',
    'Red Hat Enterprise Linux 8',
  ];

  const availableEnvironments = [
    'AWS',
    'GCP',
    'Azure',
    'Bare metal',
    'VMWare',
  ];

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
      if (isCloudEnvironment) {
        const statusLabelWithTooltip = (
          <Label color={config.color} variant={config.variant}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ExclamationTriangleIcon style={{ fontSize: '0.875rem', color: '#f0ab00' }} />
              <Tooltip
                content={
                  <div style={{ maxWidth: '300px' }}>
                    <p style={{ marginBottom: '0.5rem' }}>
                      Click to select this row and then use rebuild.
                    </p>
                    <p style={{ marginBottom: 0 }}>
                      <strong>Warning:</strong> Rebuild will pull latest changes (new package versions for example).
                    </p>
                  </div>
                }
                position="top"
              >
                <span style={{ 
                  borderBottom: '1px dotted #151515', 
                  cursor: 'pointer'
                }}>
                  {capitalizeWords(status)}
                </span>
              </Tooltip>
            </span>
          </Label>
        );
        return statusLabelWithTooltip;
      }

      const statusLabel = (
        <Label color={config.color} variant={config.variant}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ExclamationTriangleIcon style={{ fontSize: '0.875rem', color: '#f0ab00' }} />
            <span>{capitalizeWords(status)}</span>
          </span>
        </Label>
      );
      
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

    // Apply filters based on primary and secondary filter selections
    if (primaryFilter && secondaryFilter) {
      switch (primaryFilter) {
        case 'name':
          // Apply favorites filter first if selected
          if (secondaryFilter === 'favorites') {
            filtered = filtered.filter(image => image.isFavorited);
          } else if (secondaryFilter === 'non-favorites') {
            filtered = filtered.filter(image => !image.isFavorited);
          }
          
          // Apply text search if there's search text
          if (nameSearchText.trim()) {
            filtered = filtered.filter(image => 
              image.name.toLowerCase().includes(nameSearchText.toLowerCase())
            );
          }
          break;
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
  }, [imageData, primaryFilter, secondaryFilter, nameSearchText, sortField, sortDirection, page, perPage]);

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
        return ['all', 'favorites', 'non-favorites'];
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
        return secondaryFilter && ['favorites', 'non-favorites', 'all'].includes(secondaryFilter) 
          ? 'Filter by favorites' 
          : 'Search image names...';
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
      // Deselect if clicking the same option
      setPrimaryFilter('');
      setSecondaryFilter('');
    } else {
      // Select new option
      setPrimaryFilter(selectedValue);
      setSecondaryFilter(''); // Reset secondary filter
    }
    setIsPrimaryFilterOpen(false);
  };

  const onSecondaryFilterSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    const selectedValue = String(selection);
    if (secondaryFilter === selectedValue) {
      // Deselect if clicking the same option
      setSecondaryFilter('');
    } else {
      // Select new option
      setSecondaryFilter(selectedValue);
    }
    setIsSecondaryFilterOpen(false);
  };

  const clearAllFilters = () => {
    setPrimaryFilter('');
    setSecondaryFilter('');
    setNameSearchText('');
    setSortField('');
    setSortDirection('asc');
    setSelectedRows(new Set());
    setPage(1);
  };

  const hasActiveFilters = () => {
    return primaryFilter || secondaryFilter || sortField;
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
      newOpen.clear(); // Close all other dropdowns
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
    
    // For bulk migration, we'll use the first selected image as the template
    const firstSelectedImage = imageData.find(img => selectedRows.has(img.id));
    if (firstSelectedImage) {
      setSelectedImage(firstSelectedImage);
      setIsModalOpen(true);
      setAlertInfo(null);
    }
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
    
    // Insert duplicated image right after the original
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
    
    // Insert duplicated images right after their originals (in reverse order to maintain positions)
    setImageData(prevData => {
      let newData = [...prevData];
      
      // Process in reverse order to maintain correct positioning when inserting
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
    
    // Clear selection
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
    
    console.log(`Bulk rebuilding images: ${selectedImageNames.join(', ')}`);
    setAlertInfo({
      variant: AlertVariant.info,
      title: 'Rebuild Operation',
      message: `Rebuilding ${selectedRows.size} selected image${selectedRows.size > 1 ? 's' : ''}: ${selectedImageNames.join(', ')}`,
    });
  };

  const handleEditImage = (image: ImageTableRow) => {
    // Open the Build Image Modal with the selected image data pre-populated
    setSelectedImage(image);
    setIsBuildImageModalOpen(true);
    setOpenDropdowns(new Set());
  };

  const handleDeleteConfirmation = (image: ImageTableRow) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
    setOpenDropdowns(new Set());
  };

  const handleDeleteConfirm = () => {
    if (imageToDelete) {
      // Remove the image from the data
      setImageData(prevData => prevData.filter(img => img.id !== imageToDelete.id));
      
      // Remove from selected rows if it was selected
      setSelectedRows(prevSelected => {
        const newSelected = new Set(prevSelected);
        newSelected.delete(imageToDelete.id);
        return newSelected;
      });
      
      // Show success alert
      setAlertInfo({
        variant: AlertVariant.success,
        title: 'Image Deleted',
        message: `Successfully deleted "${imageToDelete.name}"`,
      });
    }
    
    // Close modal and reset state
    setIsDeleteModalOpen(false);
    setImageToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setImageToDelete(null);
  };

  const handleBuildLatest = (imageName: string, imageDetails: ImageItem) => {
    // Create a new image entry for the table
    const newImageId = String(imageData.length + 1);
    
    // Extract RHEL version from the image name
    let currentRelease = 'Red Hat Enterprise Linux 9'; // default
    if (imageName.includes('10')) {
      currentRelease = 'Red Hat Enterprise Linux 10';
    } else if (imageName.includes('9.6')) {
      currentRelease = 'Red Hat Enterprise Linux 9.6';
    } else if (imageName.includes('8.10')) {
      currentRelease = 'Red Hat Enterprise Linux 8.10';
    }
    
    // Generate a tag based on the file name
    const tag = imageDetails.fileName ? 
      imageDetails.fileName.replace(/\.(iso|qcow2)$/, '') : 
      'latest';
    
    // Generate UUID
    const uuid = crypto.randomUUID();
    
    const newImage: ImageTableRow = {
      id: newImageId,
      name: imageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      tag: tag,
      currentRelease: currentRelease,
      currentEnvironment: 'Bare metal', // All ISOs go to Bare metal
      status: 'ready',
      lastUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      dateUpdated: new Date(),
      targetEnvironment: 'Bare metal',
      version: imageName.includes('10') ? '10' : imageName.includes('9') ? '9' : '8',
      owner: 'System',
      isFavorited: false,
      uuid: uuid,
      architecture: 'x86_64',
      fileExtension: '.iso'
    };
    
    // Add the new image to the table
    setImageData(prevData => [...prevData, newImage]);
    
    // Auto-select the new image
    setSelectedRows(new Set([newImageId]));
    
    // Show success alert
    setAlertInfo({
      variant: AlertVariant.success,
      title: 'Image Built Successfully',
      message: `${imageName} has been built and added to your images with Bare metal environment.`,
    });
  };

  return (
    <>
      {/* Toast notification - rendered outside PageSection */}
      {alertInfo && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
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
            <style>
              {`
                @keyframes slideInFromRight {
                  from {
                    transform: translateX(100%);
                    opacity: 0;
                  }
                  to {
                    transform: translateX(0);
                    opacity: 1;
                  }
                }
              `}
            </style>
          </Alert>
        </div>
      )}

  <PageSection hasBodyWrapper={false} style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Demo Showcase Section */}
        {showDemoAlert && isGitHubPages && (
          <Card style={{ 
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '1px solid #dee2e6',
            borderRadius: '8px'
          }}>
            <CardBody style={{ padding: '1.5rem' }}>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem flex={{ default: 'flex_1' }}>
                  <div>
                    <Title headingLevel="h3" size="md" style={{ 
                      marginBottom: '0.5rem',
                      color: '#495057',
                      fontWeight: 600
                    }}>
                      🎬 Behind the Scenes
                    </Title>
                    <p style={{ 
                      margin: 0,
                      color: '#6c757d',
                      fontSize: '0.95rem',
                      lineHeight: '1.4'
                    }}>
                      See how this Image Builder demo is being created with Cursor AI. 
                      Watch the development process in real-time!
                    </p>
                  </div>
                </FlexItem>
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Button 
                        variant="primary" 
                        icon={<PlayIcon />}
                        onClick={() => window.open('https://youtu.be/uriJXKvVoi8', '_blank')}
                        style={{ 
                          background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
                          border: 'none',
                          color: 'white',
                          fontWeight: 600,
                          padding: '0.75rem 1.5rem'
                        }}
                      >
                        Watch Demo (Jul 7, 2025)
                      </Button>
                    </FlexItem>
                    <FlexItem>
                      <Button
                        variant="plain"
                        onClick={() => setShowDemoAlert(false)}
                        style={{ 
                          padding: '0.5rem',
                          color: '#6c757d'
                        }}
                        aria-label="Close demo section"
                      >
                        <TimesIcon style={{ fontSize: '1rem' }} />
                      </Button>
                    </FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        )}

        {/* Header */}
        <div style={{ 
          marginBottom: '1.5rem', 
          flexShrink: 0
        }}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h1" size="lg">
                <BuilderImageIcon style={{ marginRight: '0.5rem' }} />
                Image Builder
              </Title>
              <p style={{ marginTop: '0.5rem', color: '#666' }}>
                Manage and migrate your system images across releases and environments
              </p>
            </FlexItem>
            <FlexItem>
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <Button variant="secondary" onClick={() => {
                    setSelectedImage(null); // Clear selected image for creation flow
                    setIsBuildImageModalOpen(true);
                  }}>
                    Build Image
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button variant="secondary" onClick={() => setIsUseBaseImageModalOpen(true)}>
                    Use a Base Image
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button 
                    variant="secondary" 
                    onClick={() => console.log('Import clicked')}
                  >
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
              
              {/* Favorites filter dropdown for name filter */}
              {primaryFilter === 'name' && (
                <ToolbarItem>
                  <div style={{ width: '180px' }}>
                    <Dropdown
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle 
                          ref={toggleRef}
                          onClick={() => setIsSecondaryFilterOpen(!isSecondaryFilterOpen)}
                          isExpanded={isSecondaryFilterOpen}
                          style={{ width: '100%' }}
                        >
                          {secondaryFilter ? secondaryFilter.charAt(0).toUpperCase() + secondaryFilter.slice(1) : 'All images'}
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
                </ToolbarItem>
              )}

              <ToolbarItem>
                <Button
                  variant="primary"
                  icon={<EditIcon />}
                  onClick={() => {
                    if (selectedRows.size === 1) {
                      const selectedImageId = Array.from(selectedRows)[0];
                      const selectedImage = imageData.find(img => img.id === selectedImageId);
                      if (selectedImage) {
                        handleEditImage(selectedImage);
                      }
                    }
                  }}
                  isDisabled={selectedRows.size !== 1}
                >
                  Edit
                </Button>
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
                  <th style={{ padding: '1rem 0.5rem' }} onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="plain"
                      onClick={() => {
                        const newSelected = new Set(selectedRows);
                        if (newSelected.has('all')) {
                          newSelected.clear();
                        } else {
                          newSelected.add('all');
                        }
                        setSelectedRows(newSelected);
                      }}
                      style={{ padding: '0.25rem' }}
                    >
                      {selectedRows.has('all') ? (
                        <TimesIcon style={{ fontSize: '0.875rem' }} />
                      ) : (
                        <AngleDownIcon style={{ fontSize: '0.875rem' }} />
                      )}
                    </Button>
                  </th>
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
                        style={{
                          position: 'relative',
                          zIndex: 1000
                        }}
                      >
                        <DropdownList style={{
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          minWidth: '150px',
                          zIndex: 1001
                        }}>
                          <DropdownItem 
                            onClick={() => {
                              handleEditImage(image);
                            }}
                          >
                            Edit
                          </DropdownItem>
                          <Divider />
                          <DropdownItem 
                            onClick={() => {
                              openMigrationOverlay(image);
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
                            onClick={() => handleDeleteConfirmation(image)}
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

          {/* Pagination Footer - Sticky at bottom */}
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

      {/* Migration Overlay Form */}
      {isOverlayOpen && selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title headingLevel="h2" size="lg">
                Migrate Image
              </Title>
              <Button
                variant="plain"
                onClick={closeOverlay}
                isDisabled={isOverlayLoading}
                style={{ padding: '0.25rem' }}
              >
                <TimesIcon />
              </Button>
            </div>

            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Move your image to a new release and target environment.
            </p>

            {/* Form */}
            <Form>
              {/* Release Group */}
              <FormGroup
                label="Release"
                fieldId="overlay-release-group"
              >
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    marginBottom: '4px',
                    color: '#495057'
                  }}>
                    From
                  </label>
                  <TextInput
                    id="overlay-from-release"
                    value={selectedImage.currentRelease}
                    readOnly
                    style={{ 
                      backgroundColor: '#f8f9fa',
                      color: '#495057'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    marginBottom: '4px',
                    color: '#495057'
                  }}>
                    To <span style={{ color: '#c9190b' }}>*</span>
                  </label>
                  <Select
                    id="overlay-to-release-select"
                    aria-label="Select target release"
                    toggle={(toggleRef) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsOverlayReleaseSelectOpen(!isOverlayReleaseSelectOpen)}
                        isExpanded={isOverlayReleaseSelectOpen}
                        isDisabled={isOverlayLoading}
                        style={{ width: '100%' }}
                      >
                        {overlayTargetRelease || 'Choose a target release'}
                      </MenuToggle>
                    )}
                    onSelect={onOverlayReleaseSelect}
                    selected={overlayTargetRelease}
                    isOpen={isOverlayReleaseSelectOpen}
                    onOpenChange={setIsOverlayReleaseSelectOpen}
                  >
                    <SelectList>
                      {availableReleases.map((release) => (
                        <SelectOption 
                          key={release} 
                          value={release}
                          isDisabled={release === selectedImage.currentRelease}
                        >
                          {release}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                  {overlayErrors.targetRelease && (
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem variant="error">{overlayErrors.targetRelease}</HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  )}
                </div>
              </FormGroup>

              {/* Environment Group */}
              <FormGroup
                label="Environment"
                fieldId="overlay-environment-group"
              >
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    marginBottom: '4px',
                    color: '#495057'
                  }}>
                    From
                  </label>
                  <TextInput
                    id="overlay-from-environment"
                    value={selectedImage.currentEnvironment}
                    readOnly
                    style={{ 
                      backgroundColor: '#f8f9fa',
                      color: '#495057'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    marginBottom: '4px',
                    color: '#495057'
                  }}>
                    To <span style={{ color: '#c9190b' }}>*</span>
                  </label>
                  <Select
                    id="overlay-to-environment-select"
                    aria-label="Select target environment"
                    toggle={(toggleRef) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsOverlayEnvironmentSelectOpen(!isOverlayEnvironmentSelectOpen)}
                        isExpanded={isOverlayEnvironmentSelectOpen}
                        isDisabled={isOverlayLoading}
                        style={{ width: '100%' }}
                      >
                        {overlayTargetEnvironment || 'Choose a target environment'}
                      </MenuToggle>
                    )}
                    onSelect={onOverlayEnvironmentSelect}
                    selected={overlayTargetEnvironment}
                    isOpen={isOverlayEnvironmentSelectOpen}
                    onOpenChange={setIsOverlayEnvironmentSelectOpen}
                  >
                    <SelectList>
                      {availableEnvironments.map((environment) => (
                        <SelectOption 
                          key={environment} 
                          value={environment}
                          isDisabled={environment === selectedImage.currentEnvironment}
                        >
                          {environment}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                  {overlayErrors.targetEnvironment && (
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem variant="error">{overlayErrors.targetEnvironment}</HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  )}
                </div>
              </FormGroup>
            </Form>

            {/* Footer */}
            <div style={{ 
              borderTop: '1px solid #d2d2d2', 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem',
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end' 
            }}>
              <Button
                variant="primary"
                onClick={handleOverlayConfirm}
                isDisabled={isOverlayLoading}
                isLoading={isOverlayLoading}
                spinnerAriaValueText="Migrating image..."
              >
                {isOverlayLoading ? 'Migrating...' : 'Migrate Image'}
              </Button>
              <Button variant="link" onClick={closeOverlay} isDisabled={isOverlayLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <ImageMigrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageInfo={selectedImage || undefined}
        onConfirm={handleMigrationConfirm}
      />
      
      <UseBaseImageModal
        isOpen={isUseBaseImageModalOpen}
        onClose={() => setIsUseBaseImageModalOpen(false)}
        onBuildLatest={handleBuildLatest}
      />
      
      <BuildImageModal
        isOpen={isBuildImageModalOpen}
        onClose={() => setIsBuildImageModalOpen(false)}
        editingImage={selectedImage || undefined}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
      >
        <ModalHeader>
          <Title headingLevel="h2" size="lg">
            Delete image
          </Title>
        </ModalHeader>
        {imageToDelete && (
          <ModalBody style={{ padding: '24px' }}>
            <p style={{ 
              margin: 0, 
              marginBottom: '24px',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete <strong>"{imageToDelete.name}"</strong>? 
              This action cannot be undone.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end',
              marginRight: '-8px'  // Align with X button position
            }}>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
              <Button variant="link" onClick={handleDeleteCancel}>
                Cancel
              </Button>
            </div>
          </ModalBody>
        )}
      </Modal>
  </PageSection>
    </>
  );
};

export { Dashboard };
