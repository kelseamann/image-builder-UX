import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  ClipboardCopy,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Modal,
  ModalVariant,
  Popover,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

interface UseBaseImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuildLatest?: (imageName: string, imageDetails: ImageItem) => void;
}

interface ImageItem {
  name: string;
  description?: string;
  fileName?: string;
  fileSize?: string;
  sha256?: string;
  lastUpdated?: string;
}

interface ImageGroup {
  title: string;
  images: ImageItem[];
}

const UseBaseImageModal: React.FunctionComponent<UseBaseImageModalProps> = ({
  isOpen,
  onClose,
  onBuildLatest,
}) => {
  const imageGroups: ImageGroup[] = [
    {
      title: 'Network Install Images',
      images: [
        { 
          name: 'Red Hat Enterprise Linux 10 Boot ISO',
          fileName: 'rhel-10.0-x86_64-boot.iso',
          fileSize: '816 MB',
          sha256: '008eff6d005e0e418da2dc06ad323f099e02749f32d8074593abdeae4763a0fb',
          lastUpdated: '2025-04-15'
        },
        { 
          name: 'Red Hat Enterprise Linux 9.6 Boot ISO',
          fileName: 'rhel-9.6-x86_64-boot.iso',
          fileSize: '1.15 GB',
          sha256: '36a06d4c36605550c2626d5af9ee84fc2badce9e71010b7e94a9a469a0335d63',
          lastUpdated: '2025-04-22'
        },
        { 
          name: 'Red Hat Enterprise Linux 8.10 Boot ISO',
          fileName: 'rhel-8.10-x86_64-boot.iso',
          fileSize: '1020 MB',
          sha256: '6ced368628750ff3ea8a2fc52a371ba368d3377b8307caafda69070849a9e4e7',
          lastUpdated: '2024-05-20'
        },
      ],
    },
    {
      title: 'Offline Install Images',
      images: [
        { 
          name: 'Red Hat Enterprise Linux 10 Binary DVD',
          fileName: 'rhel-10.0-x86_64-dvd.iso',
          fileSize: '7.88 GB',
          sha256: 'edce2dd6f8e1d1b2ff0b204f89b0659bc9e320d175beb7caad60712957a19608',
          lastUpdated: '2025-04-15'
        },
                  { 
            name: 'Red Hat Enterprise Linux 9.6 Binary DVD',
            fileName: 'rhel-9.6-x86_64-dvd.iso',
            fileSize: '11.9 GB',
            sha256: 'febcc1359fd68faceff82d7eed8d21016e022a17e9c74e0e3f9dc3a78816b2bb',
            lastUpdated: '2025-04-22'
          },
                  { 
            name: 'Red Hat Enterprise Linux 8.10 Binary DVD',
            fileName: 'rhel-8.10-x86_64-dvd.iso',
            fileSize: '13.3 GB',
            sha256: '9b3c8e31bc2cdd2de9cf96abb3726347f5840ff3b176270647b3e66639af291b',
            lastUpdated: '2024-05-20'
          },
        
      ],
    },
    {
      title: 'Virtualization Images',
      images: [
        { 
          name: 'Red Hat Enterprise Linux 10 KVM Guest Image',
          fileName: 'rhel-10.0-x86_64-kvm.qcow2',
          fileSize: '816 MB',
          sha256: '73473542ff4622524ae200ffabd4064bb2a7ff39ac40a012443a43d429d60019',
          lastUpdated: '2025-04-25'
        },
                  { 
            name: 'Red Hat Enterprise Linux 9.6 KVM Guest Image',
            fileName: 'rhel-9.6-x86_64-kvm.qcow2',
            fileSize: '1010 MB',
            sha256: '49443696e7f2410e5647aa16f15eb7b7b08610fea92cdf3eba44ab9ec9ff899f',
            lastUpdated: '2025-04-28'
          },
                  { 
            name: 'Red Hat Enterprise Linux 8.10 KVM Guest Image',
            fileName: 'rhel-8.10-x86_64-kvm.qcow2',
            fileSize: '1020 MB',
            sha256: '820853871801754056642ead33834fbe5640421b57e07f2c084684f4d1a7d2fe',
            lastUpdated: '2024-05-15'
          },
      ],
    },
  ];

  const handleShowDetails = (imageName: string) => {
    console.log('Show details for:', imageName);
  };

  const handleDownload = (imageName: string) => {
    console.log('Download:', imageName);
  };



  const handleBuildLatest = (imageName: string) => {
    // Find the image details
    let imageDetails: ImageItem | undefined;
    for (const group of imageGroups) {
      imageDetails = group.images.find(img => img.name === imageName);
      if (imageDetails) break;
    }
    
    if (imageDetails && onBuildLatest) {
      onBuildLatest(imageName, imageDetails);
      onClose(); // Close the modal after building
    }
  };

  const renderDetailsPopover = (image: ImageItem) => {
    if (!image.fileName) {
      return (
        <div style={{ padding: '16px' }}>
          <p>Details not available for this image.</p>
        </div>
      );
    }

    return (
      <div style={{ padding: '16px', minWidth: '300px' }}>
        <div style={{ marginBottom: '12px' }}>
          <strong>File name:</strong> {image.fileName}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>File Size:</strong> {image.fileSize}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong>SHA-256 Checksum:</strong>
          <div style={{ marginTop: '4px' }}>
            <ClipboardCopy 
              isReadOnly 
              hoverTip="Copy SHA-256 checksum" 
              clickTip="Checksum copied!"
              variant="inline-compact"
            >
              {[image.sha256 || '']}
            </ClipboardCopy>
          </div>
        </div>
        <div>
          <strong>Last Updated:</strong> {image.lastUpdated}
        </div>
      </div>
    );
  };

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div style={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        maxHeight: '100%'
      }}>
        {/* Header Section */}
        <div style={{ 
          flexShrink: 0,
          padding: '32px 24px 0 32px'
        }}>
          <Title headingLevel="h1" size="xl" style={{ marginBottom: '8px' }}>
            Download RHEL
          </Title>
          <p style={{ 
            fontSize: '16px', 
            lineHeight: '1.5',
            marginBottom: '24px',
            color: '#666'
          }}>
            Use download to quickly access the latest stable version of your image, or select Build Latest to begin customizing with Image Builder.
            Let's include a link to <a href="https://developers.redhat.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>developer hub here too</a>
          </p>
        </div>
        
        {/* Content Section */}
        <div style={{ 
          flex: 1,
          padding: '24px 32px',
          overflow: 'auto'
        }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {imageGroups.map((group, groupIndex) => (
            <div key={group.title}>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                {group.title}
              </Title>
              
              <Grid hasGutter>
                {group.images.map((image) => (
                  <GridItem span={6} key={image.name}>
                    <Card style={{ 
                      height: '100%', 
                      border: '1px solid #d2d2d2',
                      borderRadius: '8px'
                    }}>
                      <CardBody style={{ 
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '100px'
                      }}>
                        <div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                          }}>
                            <h4 style={{ 
                              fontWeight: 600, 
                              fontSize: '16px',
                              lineHeight: '1.3',
                              margin: 0,
                              flex: 1,
                              paddingRight: '8px'
                            }}>
                              {image.name}
                            </h4>
                            <Popover
                              aria-label="Image details"
                              bodyContent={renderDetailsPopover(image)}
                              hasAutoWidth
                            >
                              <Button
                                variant="plain"
                                icon={<InfoCircleIcon />}
                                onClick={() => handleShowDetails(image.name)}
                                style={{ 
                                  padding: '4px',
                                  minWidth: 'auto',
                                  color: '#6A6E73'
                                }}
                              />
                            </Popover>
                          </div>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'row',
                          gap: '12px',
                          justifyContent: 'flex-start'
                        }}>
                          <Tooltip content="Last updated: December 15, 2024">
                            <Button
                              variant="primary"
                              onClick={() => handleBuildLatest(image.name)}
                              style={{ 
                                padding: '8px 16px',
                                minWidth: 'auto',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Build latest
                            </Button>
                          </Tooltip>
                          <Tooltip content="Last updated: December 12, 2024">
                            <Button
                              variant="secondary"
                              onClick={() => handleDownload(image.name)}
                              style={{ 
                                padding: '8px 16px',
                                minWidth: 'auto',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Download blueprint (.json)
                            </Button>
                          </Tooltip>
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
              
              {groupIndex < imageGroups.length - 1 && (
                <Divider style={{ marginTop: '24px' }} />
              )}
            </div>
          ))}
        </div>
        </div>
      </div>
    </Modal>
  );
};

export { UseBaseImageModal, type ImageItem }; 